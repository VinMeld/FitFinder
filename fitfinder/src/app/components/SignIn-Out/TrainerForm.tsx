import React, { useState } from "react";
import { useAuth } from "../../components/providers/supabase-auth-provider";
import { createClient } from "../../utils/supabase-browser";
import { AuthResponse } from "@supabase/supabase-js";
type TrainerFormProps = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
};

const TrainerForm: React.FC<TrainerFormProps> = ({ setTab }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signInWithEmail, signInWithGithub, user } = useAuth();
  const supabase = createClient();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    // Check if email is valid
    if (!email.includes("@")) {
      alert("Invalid email.");
      return;
    }
    // Check if password is valid
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    // Here you can handle form submission
    // For example, log the form data to console
    console.log({
      email,
      password,
      confirm,
    });
    try {
        const trainer: AuthResponse = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
            displayName,
            isuser: false,
            },
            emailRedirectTo: `${location.origin}/auth/callback`,
        },
        });
        console.log(trainer);
        setTab(6);
    } catch (error) {
        console.log("Something went wrong!", error);
    }
    
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Create Trainer Account
      </h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="john.smith@company.com"
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
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
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

export default TrainerForm;
