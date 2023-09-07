/* eslint-disable react/prop-types */
import { useLocation } from "react-router";

export const SpotInfo = () => {
  const state = useLocation();
  const data = state.state.floorDetails.arrayValue.values;
  return (
    <div className="w-full">
      <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
        <div className="sm:flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
            Parking Spots
          </p>
        </div>
      </div>
      <div className="mt-3 ml-3 grid grid-cols-3 gap-4">
        {data.map((data, index) => (
          <Floors key={index} props={data.mapValue.fields} />
        ))}
      </div>
    </div>
  );
};

function Floors({ props }) {
  const { floor_number } = props;
  const data = props.spot_Information.arrayValue.values;

  return (
    <>
      <div className="w-96 h-[30rem] border-2 shadow-md rounded-md hover:shadow-xl">
        <h1 className="p-4 bg-slate-400 font-bold text-white hover:bg-black hover:text-white">
          Floor : {floor_number.stringValue}{" "}
        </h1>
        <div className="p-3 grid gap-2 grid-cols-4">
          {data.map((data, index) => (
            <ParkingSpot key={index} props={data} />
          ))}
        </div>
      </div>
    </>
  );
}

function ParkingSpot({ props }) {
  const { is_booked, spot_name, booked_time, expereTime } =
    props.mapValue.fields;
  console.log(props.mapValue.fields);
  const timestamp_ms = booked_time;
  const date = new Date(timestamp_ms);
  const hours = date.getHours();
  const exp_hours = expereTime.stringValue / (1000 * 60 * 60);

  return (
    <>
      <div
        className="border-2 w-20 h-20 flex justify-center items-center tooltip "
        data-tip={is_booked.booleanValue ? hours + exp_hours : 0}
      >
        {is_booked.booleanValue ? (
          <img src="https://i.ibb.co/SwR4vTh/car.png" alt="" />
        ) : (
          <p className="text-green-600 font-bold">{spot_name.stringValue}</p>
        )}
      </div>
    </>
  );
}
