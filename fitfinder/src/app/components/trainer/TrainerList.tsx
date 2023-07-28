import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import Trainer from './Trainer';
import styles from '../../styles';
import Filter from '../Filter';
import { useRouter, useSearchParams } from 'next/navigation';


export default function TrainerList(props) {
  const [trainers, setTrainers] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [liked, setLiked] = useState([]);
  const [isGetMore, setIsGetMore] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams()!
  useEffect( () => {
      console.log("Got props.trainer", props.trainers)
  }, [props.trainers])
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      // Convert ReadonlyURLSearchParams to a regular object
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)  
  
      return params.toString();
    },
    [searchParams]
  );
  
  useEffect(() => {
    if(!isGetMore) return;
    const getLikedTrainers = async () => {
      const res = await fetch('http://localhost:3000/api/like', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(res.ok) {
        const data = await res.json();
        setLiked(data.result); 
        console.log(data.result);
      } else {
        console.error('Error getting liked trainers');
      }
    }
    getLikedTrainers();
    setIsGetMore(false);
  }, [isGetMore]);
  useEffect(() => {
    generateTrainers();
  }, [props.trainer]);

  useEffect(() => {
    // Checking if there's an id in the URL
    if(!searchParams) return;
    const id = searchParams.get('id');
    if(id) {
      handleOpenModal(id);
    }
  }, [searchParams]);
  

  async function generateTrainers(){
    const trainerComponents = props.trainers.map(trainer  =>
      <Trainer key={trainer.id} {...trainer} onClick={() => {
        setIsOpen(true);
        handleOpenModal(trainer.id)
      }} />
    );
    setTrainers(trainerComponents);
  };

  async function handleOpenModal(id) {
    console.log("id: ", id)
    // fetch trainer details
    console.log(id)
    const response = await fetch(`/api/trainer/${id}`);
    const data = await response.json();
    setSelectedTrainer(data[0]);
    setIsOpen(true);

    // add the id to the URL
    router.push('?' + createQueryString('id', id), { scroll: false })
  }
  function handleCloseModel() {
    if(!modalIsOpen) return;
    console.log("CLOSED")
    // fetch trainer details
    setSelectedTrainer(null);
    setIsOpen(false);

    // add the id to the URL
    router.push('?' + createQueryString('id', ''), { scroll: false })
  }
  

  return (
  <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
      
      {/* <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto">
          <Filter />
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 w-full relative z-[1]">
          {props.trainers && props.trainers.map(trainer =>
            <Trainer key={trainer.id} {...trainer} onClick={() => {
              setIsOpen(true);
              handleOpenModal(trainer.id)
            }} />
          )}
      </div>
      {modalIsOpen && selectedTrainer && liked &&
        <Modal
          handleCloseModel={handleCloseModel}
          trainer={selectedTrainer}
          setIsGetMore={setIsGetMore}
          isLike={liked.includes(selectedTrainer.id)}
          setRegenerateLikedTrainers={props.setRegenerateLikedTrainers}
        />
      }
  </section>
  )
}
