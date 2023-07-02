'use client'
import styles from '../styles'
import ProfileInfo from '../components/Profile'
import dyanmic from "next/dynamic"
import UserProfile from '../components/profiles/UserProfile'
import TrainerProfile from '../components/profiles/TrainerProfile'
import { useAuth } from '../components/providers/supabase-auth-provider'
export default function Profile() {
  const { user } = useAuth();
  return (
    <>
    { user ? 
    <div className="bg-primary w-full overflow-hidden">
     <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
         <h1> Profile page! </h1>
          {user.isuser ? <UserProfile /> : <TrainerProfile />}
        </div>
      </div>
    </div>
    :
     <h1> Error </h1>
     }
    </>
  )
}