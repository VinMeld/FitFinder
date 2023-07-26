import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import Trainer from './Trainer';
import styles from '../../styles';
import Filter from '../Filter';
import { useRouter, useSearchParams } from 'next/navigation';


export default function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams()!

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      // Convert ReadonlyURLSearchParams to a regular object
      const params = new URLSearchParams(searchParams)
      params.set(name, value)  
  
      return params.toString();
    },
    [searchParams]
  );
  

  useEffect(() => {
    generateTrainers();
  }, []);

  useEffect(() => {
    // Checking if there's an id in the URL
    if(!searchParams) return;
    const id = searchParams.get('id');
    if(id) {
      handleOpenModal(id);
    }
  }, [searchParams]);
  

  async function generateTrainers(){
    const response = await fetch('/api/trainer');
    const data = await response.json();
    const trainerComponents = data.map(trainer  =>
      <Trainer key={trainer.id} {...trainer} onClick={() => {
        console.log("CLICKED")
        setIsOpen(true);
        handleOpenModal(trainer.id)
      }} />
    );

    setTrainers(trainerComponents);
  };

  async function handleOpenModal(id) {
    console.log("id: ", id)
    // fetch trainer details
    const response = await fetch(`/api/trainer/${id}`);
    const data = await response.json();
    setSelectedTrainer(data[0]);
    setIsOpen(true);

    // add the id to the URL
    router.push('?' + createQueryString('id', id), { scroll: false })
  }

  useEffect(() => {
    if(modalIsOpen) return;
    setSelectedTrainer(null);
    setIsOpen(false);

    // remove the id from the URL
    router.push('?' + createQueryString('id', ''))
  }, [setIsOpen])

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
          {trainers.map((trainer) => trainer)}
      </div>
      {modalIsOpen &&
      <Modal
        setIsOpen={setIsOpen}
        trainer={selectedTrainer}
      />
        
      }
  </section>
  )
}
