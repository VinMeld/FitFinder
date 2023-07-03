'use client'
import styles from '../styles'
import ProfileInfo from '../components/Profile'
import dyanmic from "next/dynamic"
import UserProfile from '../components/profiles/UserProfile'
import TrainerProfile from '../components/profiles/TrainerProfile'
import { useAuth } from '../components/providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
export default function Profile() {
  const router = useRouter()
  const { user } = useAuth();
  return (
    <>
    { user ? 
    <div className="bg-primary w-full overflow-hidden">
     <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          {user.isuser ? <UserProfile /> : <TrainerProfile />}
        </div>
      </div>
    </div>
    :
     <div className="bg-primary w-full overflow-hidden">
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <h1 className='text-white ml-10'> Please login to view your profile </h1>
        </div>
      </div>
    </div>
     }
    </>
  )
}