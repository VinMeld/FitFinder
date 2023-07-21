'use client'
import styles from './styles'
import {Navbar, Hero, Signup} from './components/index'
import { Database } from '../../types/supabase'
import dyanmic from "next/dynamic"
const TrainerList = dyanmic(() => import('./components/trainer/TrainerList'))
export default function Page() {
  return (
    <>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
        <Hero />
        </div>
      </div>
      <div id='trainerList' className={`bg-primary ml-4 ${styles.flexStart}`}>
        <div  className={`${styles.boxWidth}`}>
          <TrainerList />
        </div>
      </div>
    </>
  )
}