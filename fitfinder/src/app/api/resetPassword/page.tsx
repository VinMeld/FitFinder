"use client"
import React, { useEffect, useState } from 'react';
import { createClient } from "../../utils/supabase-browser";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';


export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const supabase = createClient();
  const searchParams = useSearchParams()!
  //store in state
  const [token_hash, setTokenHash] = useState('');
  const [type, setType] = useState('');

  
  useEffect(() => {
    // Checking if there's an id in the URL
    if(!searchParams) return;
    setTokenHash(searchParams.get('token_hash'));
    setType(searchParams.get('type'));
    console.log(1);
    console.log(token_hash, type);
  }, [searchParams]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
        console.error("Passwords do not match");
        toast.error("Oops there was an error!");
        return;
    }
    console.log(password)
    console.log(token_hash, type);
    const {data:session , error:verifyError} = await supabase.auth.verifyOtp({ token_hash, type })
    if (verifyError) {
        console.error(verifyError);
        toast.error("Oops there was an error!");
        return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
        toast.error("Oops there was an error!");
        console.error(error);
    } else {
        // If password update is successful, change the tab or do something else.
        // Here we reset the input fields
        toast.success("Password changed successfully!");
        setPassword('');
        setConfirmPassword('');
    }
  }

  return (
    <>
    <ToastContainer />
    <form onSubmit={onSubmit}>
           <>
        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Enter Your New Password</h3>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your new password</label>
            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm your new password</label>
            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reset Password</button>
    </>
    </form>
    </>
  )
}
