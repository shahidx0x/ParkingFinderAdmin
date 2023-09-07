import { signInWithEmailAndPassword as login, signOut } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdmins } from "../api/getAdmins";
import { auth } from "../firebase/firebase.config";
import { logOut } from "../redux/slices/userSlice";

export const Login = () => {
  const user = useSelector((state) => state.user.user);
  const { data } = useQuery("admins", getAdmins);
  const dispatch = useDispatch();
  const isAdmin = data?.some(
    (data) => data?.fields?.email?.stringValue === user?.email
  );

  const handleLogout = () => {
    dispatch(logOut());
    signOut(auth);
  };
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    toast.promise(login(auth, data.email, data.password), {
      loading: <b>signing in ...</b>,
      success: () => <b>Sign in Success</b>,
      error: (e) => <b>{e.message}</b>,
    });
  };

  return (
    <>
      <Toaster />
      <div className="w-full grid h-screen place-items-center bg-slate-400 backdrop-blur-xl">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800 w-full shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">
              {user === null ? (
                `Sign in`
              ) : (
                <p className="text-2xl">Welcome {user.email}</p>
              )}
            </h1>
            <p className="text-sm text-gray-600">
              {user === null ? (
                `Sign in to access your account`
              ) : isAdmin ? (
                <button className="p-5 border mt-5 rounded-lg w-full font-bold text-2xl bg-purple-500 text-white animate-pulse">
                  <Link to="/dashbord/users">Go to Dashbord</Link>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-5 border mt-5 rounded-lg w-full font-bold text-2xl bg-purple-200 text-red-600 font-mono animate-pulse"
                >
                  <p>Unauthorized User</p>
                </button>
              )}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={user === null ? `space-y-12` : `hidden`}
          >
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="leroy@jenkins.com"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                  {...register("email", {})}
                />
                <div></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Password</label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="*****"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                  {...register("password", {})}
                />
                <div></div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 font-semibold rounded-md bg-indigo-600 text-gray-50"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
