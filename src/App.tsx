import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./helper/axiosInstance";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  Colors,
  BarController,
  BarElement,
  Legend,
} from "chart.js";

type IAmount = {
  category_6: number;
  category_7: number;
  category_8: number;
  category_9: number;
  category_10: number;
};

type IUserDetails = {
  id: number;
  name: string;
  location: string;
  charge_customers: boolean;
  amount: IAmount;
};

ChartJS.register(
  LinearScale,
  CategoryScale,
  Colors,
  BarController,
  BarElement,
  Legend
);

const App = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<IUserDetails>();
  const [willCharge, setWillCharge] = useState<boolean>();

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
    watch,
  } = useForm<IUserDetails>({ defaultValues: { ...userDetails } });

  // data for chart
  const data = {
    labels: ["Custom", "Category1", "Category2", "Category3", "Category4"],
    datasets: [
      {
        label: "Amount Chart",
        backgroundColor: "#F0C3F1",
        borderColor: "#ffffff",
        borderWidth: 1,
        hoverBackgroundColor: "#edb8ef",
        data: [
          watch("amount.category_6"),
          watch("amount.category_7"),
          watch("amount.category_8"),
          watch("amount.category_9"),
          watch("amount.category_10"),
        ],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // function to get user details
  const fetchUserDetails = async (authData: any) => {
    try {
      const res = await axiosInstance.get(`/admin/${authData?.id}`);

      if (res?.data?.status === 200) {
        setUserDetails(res?.data?.data);
        setValue("id", res?.data?.data?.id);
        setValue("name", res?.data?.data?.name);
        setValue("location", res?.data?.data?.location);
        setValue("amount", res?.data?.data?.amount);
        setValue("charge_customers", res?.data?.data?.charge_customers);
        setWillCharge(res?.data?.data?.charge_customers);
      }
    } catch (error: any) {
      toast.error(
        error?.response
          ? error?.response?.data?.ui_err_msg
          : "Failed to get data"
      );
    }
  };

  // function to handle data update
  const onSubmit: SubmitHandler<IUserDetails> = async (data) => {
    try {
      const res = await axiosInstance.put(`/admin/${userDetails?.id}`, {
        amount: {
          ...data?.amount,
        },
      });

      if (res?.data?.status === 200) {
        toast.success("Amount updated successfully");
        const authData = JSON.parse(localStorage.getItem("authData") || "{}");
        fetchUserDetails(authData);
      }
    } catch (error: any) {
      toast.error(
        error?.response
          ? error?.response?.data?.ui_err_msg
          : "Failed to update data"
      );
    }
  };

  // checking for token and getting user details
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    if (!authData?.token) {
      navigate("/login");
      return;
    }
    fetchUserDetails(authData);
  }, [navigate, setValue]);

  return (
    <main className="flex justify-center min-h-screen text-white bg-black">
      <div className="space-y-10 px-2 sm:px-0 w-full sm:w-[600px] my-10">
        <h1 className="text-3xl font-semibold text-center">
          {userDetails?.name}, {userDetails?.location} on Dhun Jam
        </h1>

        {/* container for options */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-2 sm:gap-5">
            {/* for user concent */}
            <p>Do you want to charge your customers for requesting songs?</p>
            <div className="flex items-center justify-center gap-5">
              <label htmlFor="yes" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={"yes"}
                  id="yes"
                  className="mr-2"
                  checked={willCharge}
                  onChange={() => {
                    setWillCharge(true);
                    setValue("charge_customers", true);
                  }}
                />
                Yes
              </label>
              <label htmlFor="no" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={"no"}
                  id="no"
                  className="mr-2"
                  checked={!willCharge}
                  onChange={() => {
                    setWillCharge(false);
                    setValue("charge_customers", false);
                  }}
                />
                No
              </label>
            </div>

            {/* required amount */}
            <p>Custom song request amount-</p>
            <input
              type="number"
              className={`w-full p-2 text-center border rounded-xl transition-all duration-300 ease-in-out ${
                willCharge ? "bg-transparent" : "bg-gray-500"
              } ${errors && errors?.amount?.category_6 && "border-red-500"}`}
              disabled={!willCharge}
              {...register("amount.category_6", {
                min: {
                  value: 99,
                  message: "Entered value should be more than 99",
                },
              })}
            />

            {/* regular song */}
            <p>Regular song request amounts, from high to low-</p>
            <div className="flex items-center justify-between gap-2 sm:gap-5">
              <input
                type="number"
                className={`w-full p-2 text-center border rounded-xl transition-all duration-300 ease-in-out ${
                  willCharge ? "bg-transparent" : "bg-gray-500"
                } ${errors && errors?.amount?.category_7 && "border-red-500"}`}
                disabled={!willCharge}
                {...register("amount.category_7", {
                  min: {
                    value: 79,
                    message: "Entered value should be more than 79",
                  },
                })}
              />
              <input
                type="number"
                className={`w-full p-2 text-center border rounded-xl transition-all duration-300 ease-in-out ${
                  willCharge ? "bg-transparent" : "bg-gray-500"
                } ${errors && errors?.amount?.category_8 && "border-red-500"}`}
                disabled={!willCharge}
                {...register("amount.category_8", {
                  min: {
                    value: 59,
                    message: "Entered value should be more than 59",
                  },
                })}
              />
              <input
                type="number"
                className={`w-full p-2 text-center border rounded-xl transition-all duration-300 ease-in-out ${
                  willCharge ? "bg-transparent" : "bg-gray-500"
                } ${errors && errors?.amount?.category_9 && "border-red-500"}`}
                disabled={!willCharge}
                {...register("amount.category_9", {
                  min: {
                    value: 39,
                    message: "Entered value should be more than 39",
                  },
                })}
              />
              <input
                type="number"
                className={`w-full p-2 text-center border rounded-xl transition-all duration-300 ease-in-out ${
                  willCharge ? "bg-transparent" : "bg-gray-500"
                } ${errors && errors?.amount?.category_10 && "border-red-500"}`}
                disabled={!willCharge}
                {...register("amount.category_10", {
                  min: {
                    value: 19,
                    message: "Entered value should be more than 19",
                  },
                })}
              />
            </div>
          </div>

          {/* adding the chart */}
          {willCharge && (
            <div className="my-10">
              <Bar data={data} options={options} />
            </div>
          )}

          {/* submit button */}
          <button
            disabled={!willCharge}
            className={`bg-btnPrimaryColor hover:border-[1px] hover:border-btnSecondaryColor transition-all ease-in-out duration-300 w-full font-semibold py-2 rounded-xl ${
              (!willCharge || errors?.amount) && "bg-gray-500 my-5"
            }`}
          >
            {isSubmitting ? "Updating ..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default App;
