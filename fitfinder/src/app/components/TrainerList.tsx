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
    for (let i = 0; i < 3; i++) {
      currTrainers.push(<Trainer />)
    }
    setTrainers(currTrainers)
  }
  return (
    <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />

      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
        <h2 className={styles.heading2}>
          Search for your trainer now! <br className="sm:block hidden" /> Select your <span className="text-gradient">Perfect</span> trainer
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1 w-full feedback-container relative z-[1]">
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