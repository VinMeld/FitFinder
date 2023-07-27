import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone';
import UserDropzone from './UserDropzone';
import { useAuth } from '../providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from '../../styles'
const TrainerList = dynamic(() => import('../trainer/TrainerList'))
const TrainerProfile = () => {
  const { user, trainer } = useAuth()
  const [likedTrainers, setLikedTrainers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [regenerateLikedTrainers, setRegenerateLikedTrainers] = useState(true);
  async function generateTrainers(){
    const response = await fetch('/api/trainer');
    let data = await response.json()
    // Filter the data and only get the data where trainer.id is in likedTrainers
    data = data.filter(trainer => likedTrainers.includes(trainer.id));
    setTrainers(data);
    console.log(data)
  };
  
  useEffect(() => {
    if(regenerateLikedTrainers) {
        getLikedTrainers();
        setRegenerateLikedTrainers(false);
    }
  }, [regenerateLikedTrainers]);

  useEffect(() => {
    generateTrainers();
  }, [likedTrainers])
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
  const getLikedTrainers = async () => {
    const res = await fetch('http://localhost:3000/api/like', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(res.ok) {
      const data = await res.json();
      setLikedTrainers(data.result); // This will cause the component to re-render
      console.log(data);
    } else {
      console.error('Error getting liked trainers');
    }
  }
  
  return (
    <>
    {user && trainer &&
        <>
        <div className="bg-black text-gray-300 rounded-lg space-y-6">
            <div className="divide-y divide-gray-700">
                <div className="flex items-center gap-4 py-4 px-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2 mb-2">
                            <h1 className="text-3xl">{user.display_name}</h1>
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
                {trainer.yoe &&  <div className="px-4 py-2">
                    <h2 className="font-medium">Years of Experience:</h2>
                    <p>{trainer.yoe} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {trainer.price_range_start &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Price Range:</h2>
                    <p>{trainer.price_range_start} - {trainer.price_range_end} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {trainer.website &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Website:</h2>
                    <p><a href={trainer.website} className="text-blue-500 hover:underline">{trainer.website}</a> <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.phone_number &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Phone Number:</h2>
                    <p>{user.phone_number} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></p>
                </div>}
                {user.email &&
                <div className="px-4 py-2">
                    <h2 className="font-medium">Email:</h2>
                    <a className="flex justify-between items-center hover:bg-gray-800">
                        <div className="flex items-center gap-2 font-medium">
                            <span className="font-medium">{user.email} <span onClick={() => router.push("/profile/edit/trainer")} className="cursor-pointer">✏️</span></span>
                        </div>
                    </a>
                </div>}
                <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handleDelete}>Delete Account</button>
            </div>
            

            <div className="divide-y divide-gray-700">
                {trainers && trainers.length > 0 &&
                    <>
                        <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
                        <h2 className={styles.heading3}>
                            Liked Trainers
                        </h2>
                      </div>
                        <TrainerList setRegenerateLikedTrainers={setRegenerateLikedTrainers} trainers={trainers} />
                    </>
                }
            </div>
        </div>
        </>
        }
    </>
    )
}

export default TrainerProfile