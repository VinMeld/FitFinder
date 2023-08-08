"use client";
import styles from "./styles";
import { Navbar, Hero, Signup } from "./components/index";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Filter from "./components/Filter";
import { useRouter, useSearchParams } from "next/navigation";
const TrainerList = dynamic(() => import("./components/trainer/TrainerList"), {
  loading: () => <p>Loading...</p>,
});
export default function Page() {
  const [trainers, setTrainers] = useState([]);
  const [regenerateLikedTrainers, setRegenerateLikedTrainers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams()!;

  async function generateTrainers() {
    let URL = '/api/trainer?';
  
    if (searchTerm) {
      URL += `search=${searchTerm}&`;
    }
  
    if (tags.length > 0) {
      URL += `tags=${tags.join(",")}`;
    }
  
    const response = await fetch(URL);
    const data = await response.json();
    setTrainers(data);
  }
  useEffect(() => {
    if (!searchParams) {
      generateTrainers();
      return;
    }
  
    let tempTags = [];
    searchParams.forEach((value, key) => {
      if (key === "searchTerm") {
        setSearchTerm(value);
      } else if (key === "tags") {
        tempTags = value.split(",");
      }
    });
  
    setTags(tempTags);
    generateTrainers();
  }, [searchParams]);
  

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
          <Filter tags={tags} setTags={setTags} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
