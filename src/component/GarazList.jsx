/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "react-modern-drawer/dist/index.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { deleteUsers } from "../api/deleteUser";
import { getFcm } from "../api/getFcm";
import { getGarages } from "../api/getGatages";
import { updateGarages } from "../api/updateGarages";
import { Loading } from "./Loading";

export function GarazList() {
  const { data, status } = useQuery("garages", getGarages);
  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();
  //   const mutation = useMutation(addUsers, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("users");
  //     },
  //   });

  return (
    <div className="flex">
      <Toaster />
      <div className="w-full sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
          <div className="sm:flex items-center justify-between">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
              Garages List
            </p>
          </div>
        </div>
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="h-16 w-full text-sm leading-none text-gray-800">
                <th className="font-bold text-left pl-4">Name/UID</th>
                <th className="font-bold text-left pl-12">GZ : Status</th>
                <th className="font-bold text-left pl-12">Address</th>
                <th className="font-bold text-left pl-20">Available Space</th>
                <th className="font-bold text-left pl-20">Book Spot</th>
                <th className="font-bold text-left pl-16">AVG Rating</th>
              </tr>
            </thead>
            <tbody className="">
              {status !== "loading" ? (
                data?.map((data) => (
                  <TableRow
                    key={data?.name?.split("/")[6]}
                    props={data}
                    user={user}
                  />
                ))
              ) : (
                <Loading />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ props, user }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const {
    name: g_name,
    floorDetails,
    isActive,
    city,
    address,
    ownerUId,
    totalSpace,
    availableSpace,
    additionalInformation,
    facilities,
    rating,
    coverImage,
    division,
  } = props.fields;

  const { name } = props;
  const uid = name.split("/");
  const [show, setShow] = useState(null);
  const [fcmData, setFcmData] = useState(null);
  const { data: fcm, status: status_fcm } = useQuery(
    ["getfcm", ownerUId],
    getFcm
  );
  useEffect(() => {
    if (status_fcm === "success") {
      setFcmData(fcm);
    }
  }, [fcm, status_fcm]);

  const mutation = useMutation("updateGarages", updateGarages, {
    onSuccess: () => {
      queryClient.invalidateQueries("garages");
    },
  });

  const del_mutation = useMutation("deleteUsers", deleteUsers, {
    onSuccess: () => {
      queryClient.invalidateQueries("garages");
    },
  });

  const handleActive = (current, id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + user.jwt,
        "Content-Type": "application/json",
      },
    };
    const toUpdate = {
      fields: {
        ...props.fields,
        isActive: {
          booleanValue: !current,
        },
      },
    };

    mutation.mutateAsync({ id, data: toUpdate, config }).then((res) => {
      const requestData = {
        to: fcmData.fields.fcmToken.stringValue,
        data: {
          title: "Attention !",
          image: current
            ? "https://static.vecteezy.com/system/resources/previews/024/596/639/original/restricted-and-dangerous-sign-traffic-road-and-stop-sign-symbol-warning-and-attention-free-png.png"
            : "https://w7.pngwing.com/pngs/848/528/png-transparent-ticks-mark-green-right-correct-symbol-sign-okay-checked-positive-thumbnail.png",

          message: current
            ? `${g_name.stringValue} Garage Disabled !`
            : `${g_name.stringValue} Garage Enable !`,
        },
      };
      const serverKey =
        "AAAAfLBUwv4:APA91bHeRkFIZUC6nfkYYCxIVEb5u_8gqXK5TwuqBnw9vlE9kz6AVOUrLWX-yvg1ku4pgxKrSlCjJOaPIagfwzKbcDUt6LhfP-ajUkZHZzGL-y-8VLr5qr2E-WFxQl_zRYHvDrirwHMz";

      const axiosConfig = {
        url: "https://fcm.googleapis.com/fcm/send",
        method: "post",
        headers: {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      axios(axiosConfig)
        .then((response) => {
          toast.success("Notification Sent");
        })
        .catch((error) => {
          toast.error("Something Went Wrong");
        });
    });
  };
  const handleDelete = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + user.jwt,
        "Content-Type": "application/json",
      },
    };
    del_mutation.mutateAsync(id, config);
  };
  const navigate = useNavigate();
  function RedirectToSpot() {
    navigate(`/dashbord/spot-information/${g_name.stringValue}`, {
      state: { floorDetails },
    });
  }
  return (
    <>
      <tr
       
        className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100"
      >
        <td  onClick={RedirectToSpot} className="pl-4 cursor-pointer">
          <div className="flex items-center">
            <div className="w-10 h-10">
              <img
                className="w-full h-full"
                src={
                  "https://cdn.tuk.dev/assets/templates/olympus/projects.png"
                }
              />
            </div>
            <div className="pl-4">
              <p className="font-medium">{g_name?.stringValue}</p>
              <p className="text-xs leading-3 text-gray-600 pt-2">{uid[6]}</p>
            </div>
          </div>
        </td>
        <td className="pl-12">
          <button
            onClick={() => handleActive(isActive?.booleanValue, uid[6])}
            className={
              isActive?.booleanValue !== true
                ? "text-sm font-medium border p-3 leading-none bg-red-400 font-mono text-white"
                : "text-sm font-bold border p-3 leading-none bg-green-400 font-mono text-base-100"
            }
          >
            {mutation.isLoading ? (
              <span className="animate-pulse text-white-300">wait...</span>
            ) : isActive?.booleanValue !== true ? (
              "Not Active"
            ) : (
              "Active"
            )}
          </button>
        </td>
        <td className="pl-12">
          <p className="font-medium">
            {city?.stringValue + division?.stringValue}
          </p>
          <p className="text-xs leading-3 text-gray-600 mt-2">
            {address?.stringValue}
          </p>
        </td>
        <td className="pl-28">
          <p className="font-medium">{availableSpace?.stringValue}</p>
        </td>
        <td className="pl-28">
          {totalSpace?.stringValue - availableSpace?.stringValue}
        </td>
        <td className="pl-20">{rating?.stringValue}</td>
      </tr>
    </>
  );
}

function parkingList() {
  return <></>;
}
