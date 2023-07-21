import React, {useState} from 'react'
import { useAuth } from '../providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
const UserProfile = () => {
  const { user } = useAuth()
  const router = useRouter()
  const handleDelete = async () => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (!confirmation) return;
    const response = await fetch('/api/users/deleteUser', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response;
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
    {user &&
        <div className="bg-black text-gray-300 rounded-lg space-y-6">
            <div className="divide-y divide-gray-700">
                <div className="flex items-center gap-4 py-4 px-4">
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
                        {user.phone_number && <div className="text-gray-500" onClick={() => router.push("/profile/edit/user")}>{user.phone_number} <span onClick={() => router.push("/profile/edit/user")} className="cursor-pointer">✏️</span></div>}
                    </div>
                </div>
            </div>
            {user.email && <a onClick={() => router.push("/profile/edit/user")} className="flex justify-between items-center px-4 py-2 hover:bg-gray-800">
                <div className="flex items-center gap-2 font-medium">
                    <span className="font-medium" onClick={() => router.push("/profile/edit/user")}>{user.email} <span onClick={() => router.push("/profile/edit/user")} className="cursor-pointer">✏️</span></span>
                </div>
            </a>}
            <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handleDelete}>Delete Account</button>
        </div>
    }
    </>
  )
}

export default UserProfile