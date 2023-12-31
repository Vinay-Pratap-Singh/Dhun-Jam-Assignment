import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../helper/axiosInstance";
import { toast } from "react-hot-toast";

type ILoginData = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ILoginData>();

  // function to handle form submit
  const onSubmit: SubmitHandler<ILoginData> = async (data) => {
    try {
      if (data?.password.length < 8) {
        toast.error("Please enter a valid password");
        return;
      }
      const res = await axiosInstance.post("/admin/login", data);
      if (res?.data?.status === 200) {
        toast.success("Login successfull");
        localStorage.setItem("authData", JSON.stringify(res?.data?.data));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.response ? error?.response?.data?.ui_err_msg : "Failed to login"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-white bg-black">
      {/* form container */}
      <div className="space-y-10 px-2 sm:px-0 w-full sm:w-[600px]">
        <h1 className="text-3xl font-semibold text-center">
          Venue Admin Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* for username */}
          <div>
            <input
              className="w-full p-2 bg-transparent border rounded-xl"
              type="text"
              placeholder="Username"
              {...register("username", {
                required: { value: true, message: "Please enter username" },
              })}
            />

            {/* for displaying error */}
            {errors?.username && (
              <p className="mt-2 text-sm text-red-500">
                * {errors?.username?.message}
              </p>
            )}
          </div>

          {/* for password */}
          <div className="relative flex flex-col mt-5">
            <input
              className="w-full p-2 bg-transparent border rounded-xl"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: { value: true, message: "Please enter password" },
              })}
            />
            {isPasswordVisible ? (
              <button
                type="button"
                className="absolute self-center transform translate-y-[40%] right-2"
                onClick={() => setIsPasswordVisible(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="absolute self-center transform translate-y-[40%] right-2"
                onClick={() => setIsPasswordVisible(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}

            {/* for displaying error */}
            {errors?.password && (
              <p className="mt-2 text-sm text-red-500">
                * {errors?.password?.message}
              </p>
            )}
          </div>

          <button className="bg-btnPrimaryColor hover:border-[1px] hover:border-btnSecondaryColor transition-all ease-in-out duration-300 w-full font-semibold py-2 rounded-xl mt-10 my-3">
            {isSubmitting ? "Signing in ..." : "Sign In"}
          </button>
          <Link to={"#"}>
            <p className="text-sm text-center">New Registeration ?</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
