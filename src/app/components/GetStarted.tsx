import styles from "../styles";
import Image from "next/image";
import UserManager from "./SignIn-Out/FormManager";
import { useState } from "react";
import { useAuth } from "../components/providers/supabase-auth-provider";
import Link from "next/link";
const GetStarted = () => {
  const [showUserManager, setShowUserManager] = useState(false);
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <div>
          <Link
            className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
            href="#trainerList"
            passHref
          >
            <div
              className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
            >
              <div className={`${styles.flexStart} flex-row`}>
                <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
                  <span className="text-white">Check</span>
                </p>
                <Image
                  src="/arrow-up.svg"
                  alt="arrow-up"
                  width="23"
                  height="23"
                  className="w-[23px] h-[23px] object-contain"
                />
              </div>
              <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
                <span className="text-white">our trainers!</span>
              </p>
            </div>
          </Link>
          {showUserManager && (
            <UserManager setShowUserManager={setShowUserManager} />
          )}
        </div>
      ) : (
        <div>
          <div
            className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
            onClick={() => {
              setShowUserManager(true);
            }}
          >
            <div
              className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
            >
              <div className={`${styles.flexStart} flex-row`}>
                <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
                  <span className="text-white">Get</span>
                </p>
                <Image
                  src="/arrow-up.svg"
                  alt="arrow-up"
                  width="23"
                  height="23"
                  className="w-[23px] h-[23px] object-contain"
                />
              </div>
              <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
                <span className="text-white">Started</span>
              </p>
            </div>
          </div>
          {showUserManager && (
            <UserManager setShowUserManager={setShowUserManager} />
          )}
        </div>
      )}
    </>
  );
};

export default GetStarted;
