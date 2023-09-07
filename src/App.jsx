/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import { Chat } from "./component/Chat";
import { GarazList } from "./component/GarazList";
import { Login } from "./component/Login";
import MessagePanel from "./component/MessagePanel";
import { SideNavbar } from "./component/SideNavBar";
import { SpotInfo } from "./component/SpotInfo";
import { UserList } from "./component/UserList";
import { auth } from "./firebase/firebase.config";
import { isLoading, loginUser } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((authorized_user) => {
      if (authorized_user) {
        dispatch(
          loginUser({
            uid: authorized_user.uid,
            email: authorized_user.email,
            jwt: authorized_user.accessToken,
          })
        );
        dispatch(isLoading(false));
      } else {
        console.log("user not logged in");
      }
    });
  }, []);
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/dashbord",
      element: <Dashbord />,
      children: [
        {
          path: "spot-information/:gname",
          element: (
            <Admin>
              <SpotInfo />
            </Admin>
          ),
        },
        {
          path: "message",
          element: (
            <Admin>
              <MessagePanel />
            </Admin>
          ),
          children: [
            {
              path: "person/:param",
              element: <Chat />,
            },
          ],
        },
        {
          path: "users",
          element: (
            <Admin>
              <UserList />
            </Admin>
          ),
        },
        {
          path: "garages",
          element: (
            <Admin>
              <GarazList />
            </Admin>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}
function Root() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}

function Dashbord() {
  return (
    <>
      <div className="flex ">
        <SideNavbar />
        <Outlet />
      </div>
    </>
  );
}

export default App;

function Admin({ children }) {
  const user = useSelector((state) => state.user);
  if (user.user === null) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
}
