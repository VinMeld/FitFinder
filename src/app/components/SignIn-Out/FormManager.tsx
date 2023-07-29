import React, { useState, useEffect } from "react";
import SelectUserType from "./SelectUserType";
import Signin from "./Signin";
import UserForm from "./UserForm";
import TrainerForm from "./TrainerForm";
import LostPassword from "./LostPassword";
import ResetPassword from "./ResetPassword";
type UserManagerProps = {
  setShowUserManager: React.Dispatch<React.SetStateAction<boolean>>;
};
const UserManager: React.FC<UserManagerProps> = ({ setShowUserManager }) => {
  const [tab, setTab] = useState(-2);
  useEffect(() => {
    setTab(0);
  }, []);
  const tabManager = () => {
    switch (tab) {
      case 6:
        setShowUserManager(false);
      case 0:
        return <Signin setTab={setTab} />;
      case 1:
        return <SelectUserType setTab={setTab} />;
      case 2:
        return <UserForm setTab={setTab} />;
      case 3:
        return <TrainerForm setTab={setTab} />;
      case 4:
        return <LostPassword setTab={setTab} />;
      case 5:
        return <ResetPassword setTab={setTab} />;
      default:
        return <Signin setTab={setTab} />;
    }
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black opacity-60"
          style={{ backdropFilter: "blur(5px)" }}
          onClick={() => setShowUserManager(false)}
        >
          {" "}
        </div>
        <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            onClick={() => setShowUserManager(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            {tab != -1 ? (
              tabManager()
            ) : (
              <h3 className="text-white">Loading...</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManager;
