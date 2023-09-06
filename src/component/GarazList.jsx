/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
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
            <div>
              <button
                onClick={() => window.my_modal_1.showModal()}
                className=" hidden  sm:ml-3 mt-4 sm:mt-0 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
              >
                <p className="text-sm font-medium leading-none text-white">
                  Add User
                </p>
              </button>

              <dialog id="my_modal_1" className="modal">
                <form method="dialog" className="modal-box">
                  <div className="font-bold text-lg p-3 w-full text-black bg-gray-400">
                    Add User
                  </div>
                  <p className="py-4">
                    Press ESC key or click the button below to close
                  </p>

                  <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </div>
                </form>
              </dialog>
            </div>
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
  const [isOpen, setIsOpen] = useState(true);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
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
  return (
    <>
      <tr
        onClick={() => window.my_modal_1.showModal()}
        className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100"
      >
        <td className="pl-4 cursor-pointer">
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
        <td className="px-7 2xl:px-0 hidden">
          {show == 0 ? (
            <button
              onClick={() => setShow(null)}
              className="focus:outline-none pl-7"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4.16667 10.8334C4.62691 10.8334 5 10.4603 5 10.0001C5 9.53984 4.62691 9.16675 4.16667 9.16675C3.70643 9.16675 3.33334 9.53984 3.33334 10.0001C3.33334 10.4603 3.70643 10.8334 4.16667 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10.8334C10.4602 10.8334 10.8333 10.4603 10.8333 10.0001C10.8333 9.53984 10.4602 9.16675 10 9.16675C9.53976 9.16675 9.16666 9.53984 9.16666 10.0001C9.16666 10.4603 9.53976 10.8334 10 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8333 10.8334C16.2936 10.8334 16.6667 10.4603 16.6667 10.0001C16.6667 9.53984 16.2936 9.16675 15.8333 9.16675C15.3731 9.16675 15 9.53984 15 10.0001C15 10.4603 15.3731 10.8334 15.8333 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShow(0)}
              className="focus:outline-none pl-7"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4.16667 10.8334C4.62691 10.8334 5 10.4603 5 10.0001C5 9.53984 4.62691 9.16675 4.16667 9.16675C3.70643 9.16675 3.33334 9.53984 3.33334 10.0001C3.33334 10.4603 3.70643 10.8334 4.16667 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10.8334C10.4602 10.8334 10.8333 10.4603 10.8333 10.0001C10.8333 9.53984 10.4602 9.16675 10 9.16675C9.53976 9.16675 9.16666 9.53984 9.16666 10.0001C9.16666 10.4603 9.53976 10.8334 10 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8333 10.8334C16.2936 10.8334 16.6667 10.4603 16.6667 10.0001C16.6667 9.53984 16.2936 9.16675 15.8333 9.16675C15.3731 9.16675 15 9.53984 15 10.0001C15 10.4603 15.3731 10.8334 15.8333 10.8334Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {show == 0 && (
            <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 ">
              <div className="text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white">
                <p>Edit</p>
              </div>
              <div
                onClick={() => handleDelete(uid[6])}
                className="text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
              >
                <p>Delete</p>
              </div>
            </div>
          )}
        </td>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              Press ESC key or click the button below to <close></close>
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </tr>
    </>
  );
}
