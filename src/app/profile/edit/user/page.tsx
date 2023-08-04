"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../components/providers/supabase-auth-provider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function UserEdit() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [location, setLocation] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phone_number || 0);
      setLocation(user.location || 0);
    }
  }, [user]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if(displayName === ""){
      toast.error("Display name is required");
      return;
    } 
    const userData = {
      display_name: displayName,
      email: email,
      phone_number: phoneNumber,
      location: location,
    };

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        toast.error("Oops there was an error!");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        toast.success("Profile updated successfully!");
        console.log(`Update was successful, status code: ${response.status}`);
      }
    } catch (error) {
      toast.error("Oops there was an error!");
      console.error("There was a problem with the fetch operation: ", error);
    }
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required("Display name is required"),
    price_range_start: Yup.number().required("Pricing start is required"),
    price_range_end: Yup.number().moreThan(
      Yup.ref("price_range_start"),
      "End price must be greater than start price"
    ),
    phone_number: Yup.string().matches(
      phoneRegExp,
      "Phone number is not valid"
    ),
  });

  return (
    <>
      <ToastContainer />
      <div className=" bg-black flex items-center justify-center">
        <div className="w-4/5 h-auto bg-black">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-6 group">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Display Name
                </label>
                <input
                  type="text"
                  name="floating_first_name"
                  id="floating_first_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
