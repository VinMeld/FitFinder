import React, {useState} from 'react'
import { useAuth } from '../../components/providers/supabase-auth-provider'; 
import router from 'next/router';
import { AuthResponse } from "@supabase/supabase-js";

import {createClient} from "../../utils/supabase-browser"
import { revalidatePath } from 'next/cache';

type UserFormProps = {
    setTab: React.Dispatch<React.SetStateAction<number>>;
}

const UserForm : React.FC<UserFormProps> = ({setTab}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const supabase= createClient();
  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(email,password)
    // Check if passwords match
    if (password !== confirm) {
        alert('Passwords do not match.')
        return
    }
    // Check if email is valid
    if (!email.includes('@')) {
        alert('Invalid email.')
        return
    }
    // Check if password is valid
    if (password.length < 8) {
        alert('Password must be at least 8 characters.')
        return
    }
    // Send user to backend
    const user = {email, password}
    // Get result of fetch
    try {
        const user: AuthResponse = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { isuser: true },
            emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        console.log(user);
    } catch (error) {
        console.error('Error:', error);
    }
    setTab(6)
  }
  return (
    <>
    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create User Account</h3>
    <form className="space-y-6" action="#" onSubmit={registerUser}>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input onChange={(e) => setConfirm(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <button  type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Account</button>
        </form>
    </>
  )
}

export default UserForm