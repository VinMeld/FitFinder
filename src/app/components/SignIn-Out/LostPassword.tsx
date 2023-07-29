import React, { useState } from "react";
import { createClient } from "../../utils/supabase-browser";
import { toast, ToastContainer } from "react-toastify";

type LostPasswordProps = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
};

const LostPassword: React.FC<LostPasswordProps> = ({ setTab }) => {
  const [email, setEmail] = useState("");

  const supabase = createClient();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  const resetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${API_URL}/resetPassword`,
    });

    if (error) {
      toast.error("Error sending reset password email");
      console.log(error);
    }
    toast.success("Reset password email sent!");
  };

  return (
    <>
      <ToastContainer />
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Enter Your Email to Reset Password
      </h3>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@company.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={resetPassword}
      >
        Reset Password
      </button>
    </>
  );
};

export default LostPassword;
