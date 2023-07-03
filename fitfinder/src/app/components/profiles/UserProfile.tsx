import React, {useState} from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone';
import UserDropzone from './UserDropzone';
import { useAuth } from '../providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
const UserProfile = () => {
  const { user } = useAuth()
  const router = useRouter()

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
                            <div>
                                <h1 className="text-3xl">{user.first_name} {user.last_name}</h1>
                                {user.location && <p className="text-gray-500" onClick={() => router.push("/profile/edit/user")}>{user.location} <span onClick={() => router.push("/profile/edit/user")} className="cursor-pointer">✏️</span></p>}
                            </div>
                            <div className="relative justify-self-end ml-auto">
                                <button onClick={() => router.push("/profile/edit/user")} className="btn btn-outline gap-2" >
                                    Edit Account
                                </button>
                            </div>
                        </div>
                        {user.phoneNumber && <div className="text-gray-500" onClick={() => router.push("/profile/edit/user")}>{user.phoneNumber} <span onClick={() => router.push("/profile/edit/user")} className="cursor-pointer">✏️</span></div>}
                    </div>
                </div>
            </div>
            {user.email && <a onClick={() => router.push("/profile/edit/user")} href="https://www.roomies.ca/account/edit" className="flex justify-between items-center px-4 py-2 hover:bg-gray-800">
                <div className="flex items-center gap-2 font-medium">
                    <span className="font-medium" onClick={() => router.push("/profile/edit/user")}>{user.email} <span onClick={() => router.push("/profile/edit/user")} className="cursor-pointer">✏️</span></span>
                </div>
            </a>}
        </div>
    </>
  )
}

export default UserProfile