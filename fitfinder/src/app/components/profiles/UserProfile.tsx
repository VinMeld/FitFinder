import React, {useState} from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone';
import UserDropzone from './UserDropzone';
import { useAuth } from '../providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
const UserProfile = () => {
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false); // This state is used to control the visibility of the dropdown menu
  const router = useRouter()
  // Function to toggle the visibility of the dropdown menu
  const toggleMenu = () => {
    setShowMenu(prevState => !prevState);
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
                            <button onClick={() => router.push("/profile/user/edit")} className="btn btn-outline gap-2" >
                                Edit Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <a href="https://www.roomies.ca/account/edit" className="flex justify-between items-center px-4 py-2 hover:bg-gray-800">
                <div className="flex items-center gap-2 font-medium">
                    <span className="font-medium">{user.email}</span>
                </div>
                <span className="text-xs">Edit</span>
            </a>
               
            </div>
        </div>
    </>
  )
}
 {/* <a href="https://www.roomies.ca/phone-verification" className="flex justify-between items-center px-4 py-2 hover:bg-gray-800">
                    <span className="flex items-center gap-2 font-medium">
                        <Image width="320" height="160" src="/Discount.svg" className="inline-block h-4" alt="CA flag" />                                    
                        (613) 315-5760
                    </span>
                    <span className="text-xs">Edit</span>
                </a> */}
export default UserProfile