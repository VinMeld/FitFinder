import React, {useState} from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone';
import UserDropzone from './UserDropzone';
import { useAuth } from '../providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
const TrainerProfile = () => {
  const { user } = useAuth()
  const router = useRouter()
  // Function to toggle the visibility of the dropdown menu
  console.log(user)
  const handleDelete = async () => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (!confirmation) return;
    const response = await fetch('/api/users/deleteUser', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response;
    if (!response.ok) {
      // handle error
      console.error(data);
    } else {
      // handle success, e.g. redirect to homepage
      router.push("/");
    }
  };
  
  return (
    <>
        <div className="bg-black text-gray-300 rounded-lg space-y-6">
            <div className="divide-y divide-gray-700">
                <div className="flex items-center gap-4 py-4 px-4">
                    <div className="relative">
                        <UserDropzone className="flex-shrink-0 flex justify-center items-center border-2 hover:border-pink transition-all p-0.5">
                            <Image width="320" height="160" src="/Discount.svg" alt="Photo of Howard" className="rounded-full h-14 w-14" />
                        </UserDropzone>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2 mb-2">
                            <h1 className="text-3xl">{user.first_name}</h1>
                            <div className="relative justify-self-end ml-auto">
                                <button onClick={() => router.push("/profile/edit/trainer")} className="btn btn-outline gap-2" >
                                    Edit Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {user.location && <div className="px-4 py-2">
                    <h2 className="font-medium">Location:</h2>
                    <p>{user.location} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>
                }
                {user.yearsOfExperience &&  <div className="px-4 py-2">
                    <h2 className="font-medium">Years of Experience:</h2>
                    <p>{user.yearsOfExperience} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.priceRangeStart &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Price Range:</h2>
                    <p>{user.priceRangeStart} - {user.priceRangeEnd} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.website &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Website:</h2>
                    <p><a href={user.website} className="text-blue-500 hover:underline">{user.website}</a> <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.phoneNumber &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Phone Number:</h2>
                    <p>{user.phoneNumber} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.email &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Email:</h2>
                    <a href="https://www.roomies.ca/account/edit" className="flex justify-between items-center hover:bg-gray-800">
                        <div className="flex items-center gap-2 font-medium">
                            <span className="font-medium">{user.email} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></span>
                        </div>
                    </a>
                </div>}
                <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handleDelete}>Delete Account</button>
            </div>
        </div>
    </>

  )
}

export default TrainerProfile