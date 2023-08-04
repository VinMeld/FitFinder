"use client";
import React, { useState } from "react";
import { AuthResponse } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserFormProps = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
};

const UserForm: React.FC<UserFormProps> = ({ setTab }) => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("123456789");
  const [confirm, setConfirm] = useState("123456789");
  const supabase = createClientComponentClient();
  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    // Check if email is valid
    if (!email.includes("@")) {
      toast.error("Invalid email!");
      return;
    }
    // Check if password is valid
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    // Get result of fetch
    try {
      const user: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { isuser: true, display_name: displayName },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (user) {
        toast.success("An email has been sent to your account!");
        setTab(6);
      } else {
        toast.error("Oops there was an error, try a new email!");
      }
    } catch (error) {
      toast.error("Oops there was an error!");
      console.error("Error:", error);
    }
  };
  return (
    <>
      <ToastContainer />
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Create User Account
      </h3>
      <form className="space-y-6" action="#" onSubmit={registerUser}>
        <div className="flex space-x-4">
          <div>
            <label
              htmlFor="firstName"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="John"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create Account
        </button>
      </form>
    </>
  );
};

export default UserForm;
