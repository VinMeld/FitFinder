'use client'
import styles from '../styles'
import ProfileInfo from '../components/Profile'
import dyanmic from "next/dynamic"
export default function Profile() {
  return (
      <div className="bg-primary w-full overflow-hidden">
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
          <ProfileInfo />
          </div>
        </div>
    </div>
  )
}