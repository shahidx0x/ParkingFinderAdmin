/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { getAdminMsg } from "../api/getAdminMsg";
import { getUserById } from "../api/getUserById";

const MessagePanel = () => {
  const { user } = useSelector((state) => state.user);
  const { data, status, refetch } = useQuery("adminMsg", getAdminMsg);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [uniqueSenders, setUniqueSenders] = useState(new Set());
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (status === "success") {
      setDoc(data);
    }
  }, [status, data]);

  useEffect(() => {
    if (doc) {
      const updatedFilteredDocuments = [];
      const updatedUniqueSenders = new Set();
      for (const each_data of doc.documents) {
        const senderId = each_data.fields.senderId.stringValue;
        if (senderId === user.uid) {
          continue;
        }
        if (!updatedUniqueSenders.has(senderId)) {
          updatedFilteredDocuments.push(each_data);
          updatedUniqueSenders.add(senderId);
        }
      }
      setFilteredDocuments(updatedFilteredDocuments);
      setUniqueSenders(updatedUniqueSenders);
    }
  }, [doc, user.uid]);

  useEffect(() => {
    if (status === "success") {
      refetch({ force: true });
    }
  }, [status, refetch]);

  return (
    <div className="flex gap-10">
      <div>
        <div className="h-full p-3 space-y-2 w-60 bg-gray-50 text-gray-800">
          <div className="flex items-center p-2 space-x-4">
            <div className="p-2 border-b-2 text-black w-full">
              <h2 className="text-2xl font-semibold font-mono">Customers</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-300">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              {filteredDocuments
                ?.slice()
                .reverse()
                .map((data, index) => (
                  <CustomerList key={index} props={data} />
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="p-3 text-2xl mt-2.5 font-bold border-b-2 w-full">
          Messages
        </div>
        <div className="h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;

function CustomerList({ props }) {
  const { senderId } = props.fields;
  const id = senderId.stringValue;
  const { data, status } = useQuery(["getUserById", id], getUserById);

  return (
    <>
      <li className="bg-base-100 hover:bg-purple-400 hover:text-white">
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? "flex items-center p-2 space-x-3 rounded-md"
              : isActive
              ? "flex bg-purple-700 text-white items-center p-2 space-x-3 rounded-md "
              : "flex items-center p-2 space-x-3 rounded-md"
          }
          to={`/dashbord/message/person/${senderId.stringValue}`}
        >
          <div className="flex items-center p-2 space-x-4">
            <img
              src={
                data?.profileUrl.stringValue
                  ? data?.profileUrl?.stringValue
                  : "https://toppng.com/uploads/preview/avatar-png-11554021819gij72acuim.png"
              }
              alt=""
              className="w-12 h-12 rounded-full bg-gray-500"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {data?.userName?.stringValue}
              </h2>
              <span className="flex items-center space-x-1">
                <a rel="noopener noreferrer" href="#" className="text-xs ">
                  View profile
                </a>
              </span>
            </div>
          </div>
        </NavLink>
      </li>
    </>
  );
}
