'use client'
import styles from './styles'
import {Navbar, Hero, Filter, Signup} from './components/index'
import dyanmic from "next/dynamic"
const TrainerList = dyanmic(() => import('./components/TrainerList'))
export default function Page() {
  return (
    <>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
        <Hero />
        </div>
      </div>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Filter />
        </div>
      </div>
      <div className={`bg-primary ml-4 ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <TrainerList />
        </div>
      </div>
    </>
  )
}