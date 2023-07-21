import React, { useEffect, useState, FC } from 'react'
import Trainer from './Trainer'
import styles from '../../styles'
import Filter from '../Filter'
export default function TrainerList() {
  const [trainers, setTrainers]: any = useState([])
  useEffect(() => {
    generateTrainers()
  }, [])
  async function generateTrainers(){
    const trainers = fetch('/api/trainer')
    .then(response => response.json()) // Parsing the JSON data from the response
      .then(data => {
        const trainerComponents = data.map(trainer  =>
          <Trainer key={trainer.id} {...trainer} /> 
        );
        setTrainers(trainerComponents);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  return (
  <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
          <h2 className={styles.heading2}>
              Search for your trainer now!
          </h2>
      </div>
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto">
          <Filter />
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