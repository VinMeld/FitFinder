"use client"
import styles from './styles'
import {Navbar, Hero, Signup} from './components/index'
import { Database } from '../../types/supabase'
import dynamic from "next/dynamic"
import { useState, useEffect } from 'react'
const TrainerList = dynamic(() => import('./components/trainer/TrainerList'))

export default function Page() {
  const trainer_id = "486e7d04-e517-474c-906f-90592884b5d2"; // Replace this with your actual trainer_id
  const [likedTrainers, setLikedTrainers] = useState([]);

  const likeTrainer = async () => {
    const res = await fetch('http://localhost:3000/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trainer_id })
    });

    if(res.ok) {
      console.log('Successfully liked the trainer');
      getLikedTrainers(); // Refresh liked trainers after liking a trainer
    } else {
      console.error('Error liking the trainer');
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
      setLikedTrainers(data); // This will cause the component to re-render
      console.log(data);
    } else {
      console.error('Error getting liked trainers');
    }
  }

  useEffect(() => {
    getLikedTrainers();
  }, []);

  return (
    <>
      <button onClick={likeTrainer} style={{backgroundColor: 'white'}}>Like trainer !</button>
      <div>
      <pre style={{color: 'white'}}>Liked Trainers by this user{JSON.stringify(likedTrainers, null, 2)}</pre>

      </div>
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
