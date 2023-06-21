import React, { useEffect, useState, FC } from 'react'
import Trainer from './Trainer'
import styles from '../styles'
export default function TrainerList() {
  const [trainers, setTrainers]: any = useState([])
  useEffect(() => {
    generateTrainers()
  }, [])
  function generateTrainers(){
    const currTrainers = []
    for (let i = 0; i < 30; i++) {
      currTrainers.push(<Trainer />)
    }
    setTrainers(currTrainers)
  }
  return (
    <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
        <h2 className={styles.heading2}>
          Search for your trainer now!
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 w-full relative z-[1]">
        {trainers.map((trainer: any) => trainer)}
      </div>
    </section>
  )
}

/*    <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1">
      {trainers && trainers.map((trainer : any) => {
        return trainer
      })}
    </div> */