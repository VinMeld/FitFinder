import styles from "../styles";
import Image from "next/image";
import UserManager from "./SignIn-Out/UserManager";
import { useState } from 'react';

const GetStarted = () => {
  const [showUserManager, setShowUserManager] = useState(false);
  return (
    <div>
      <div className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`} onClick={() => {
        console.log("CLICKED");
        setShowUserManager(true);
      }}>
        <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`} >
          <div className={`${styles.flexStart} flex-row`}>
            <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
              <span className="text-white">Get</span>
            </p>
            <Image src="/arrow-up.svg" alt="arrow-up" width="23" height="23" className="w-[23px] h-[23px] object-contain" />
          </div>
          
          <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
            <span className="text-white">Started</span>
          </p>
        </div>
      </div>
      {showUserManager && <UserManager setShowUserManager={setShowUserManager} />}
    </div>
  );
}

export default GetStarted;
