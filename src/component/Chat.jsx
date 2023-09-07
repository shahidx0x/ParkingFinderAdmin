/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getAdminMsg } from "../api/getAdminMsg";
import { getUserById } from "../api/getUserById";

/* eslint-disable react/prop-types */
export const Chat = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const id = params.param;
  const { data, status, refetch } = useQuery("adminMsg", getAdminMsg);
  const [customerMsg, SetCustomerMsg] = useState(null);
  const [adminMsg, SetAdminMsg] = useState(null);

  useEffect(() => {
    if (status === "success") {
      const temp_customer = [];
      const temp_admin = [];
      for (const each_data of data.documents) {
        if (each_data.fields.senderId.stringValue === id) {
          temp_customer.push(each_data);
        } else if (each_data.fields.senderId.stringValue === user.uid) {
          temp_admin.push(each_data);
        }
      }
      SetCustomerMsg(temp_customer);
      SetAdminMsg(temp_admin);
    }
  }, [data?.documents, id, status, user.uid]);

  return (
    <>
      <div className="border-2 w-[50rem]  ">
        {customerMsg?.map((data, index) => (
          <CustomerMsg props={data} key={index} param={params} />
        ))}
        {adminMsg?.map((data, index) => (
          <AdminMsg props={data} key={index} adminUid={user.uid} />
        ))}
      </div>
      <div className="join mt-3">
        <div>
          <div>
            <input
              className="input input-bordered join-item w-[46rem]"
              placeholder="Write Message"
            />
          </div>
        </div>

        <div className="indicator">
          <button className="btn join-item font-bold btn-primary">Send</button>
        </div>
      </div>
    </>
  );
};

function CustomerMsg({ props, param }) {
  const id = param.param;
  const { data, status } = useQuery(["getUserById", id], getUserById);

  return (
    <>
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              src={
                data?.profileUrl.stringValue ||
                "https://toppng.com/uploads/preview/avatar-png-11554021819gij72acuim.png"
              }
            />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">{props.fields.message.stringValue}</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
    </>
  );
}

function AdminMsg({ props }) {
  return (
    <>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
    </>
  );
}
