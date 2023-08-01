"use client";
import styles from "./styles";
import { Navbar, Hero, Signup } from "./components/index";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Filter from "./components/Filter";
const TrainerList = dynamic(() => import("./components/trainer/TrainerList"), {
  loading: () => <p>Loading...</p>,
});
export default function Page() {
  const [trainers, setTrainers] = useState([]);
  const [regenerateLikedTrainers, setRegenerateLikedTrainers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function generateTrainers() {
    const response = await fetch(`/api/trainer?search=${searchTerm}`);
    const data = await response.json();
    setTrainers(data);
  }

  useEffect(() => {
    generateTrainers();
  }, [searchTerm]);

  return (
    <>
      <ToastContainer />
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
      <div className={`${styles.flexStart} px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto`}>
        <div className={`${styles.boxWidth}`}>
          <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>      
      <div
        id="trainerList"
        className={`bg-primary ml-4 ${styles.flexStart} px-8`}
      >
        <div className={`${styles.boxWidth}`}>
          {trainers && (
            <TrainerList
              setRegenerateLikedTrainers={setRegenerateLikedTrainers}
              trainers={trainers}
            />
          )}
        </div>
      </div>
    </>
  );
}
