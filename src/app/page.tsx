"use client"
import styles from './styles'
import {Navbar, Hero, Signup} from './components/index'
import { Database } from '../../types/supabase'
import dynamic from "next/dynamic"
import React, { useState, useEffect } from 'react'
const TrainerList = dynamic(() => import('./components/trainer/TrainerList'))

export default function Page() {
  const [trainers, setTrainers] = useState([]);
  const [regenerateLikedTrainers, setRegenerateLikedTrainers] = useState(true);
  
  async function generateTrainers() {
    const response = await fetch('/api/trainer');
    const data = await response.json();
    setTrainers(data);
    console.log(data)
  };

  useEffect(() => {
    console.log("Fetching trainers...");
    generateTrainers();
  
    return () => {
      console.log("Unmounting component...");
    };
  }, []);
  
  return (
    <>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>
      <div className={`${styles.flexStart}`}>
        <h2 className={styles.heading2}>
            Search for your <span className="text-gradient">trainer</span> now!
        </h2>
    </div>
      <div id='trainerList' className={`bg-primary ml-4 ${styles.flexStart} px-8`}>
        <div  className={`${styles.boxWidth}`}>
          { trainers &&
          <> 
            <TrainerList setRegenerateLikedTrainers={setRegenerateLikedTrainers} trainers={trainers} />
            </>
          }
        </div>
      </div>
    </>
  )
}