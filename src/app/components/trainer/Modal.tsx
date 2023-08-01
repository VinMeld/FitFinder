import React, { useState, useEffect } from "react";
import Image from "next/image";
import Carousel from './Carousel'
import { useAuth } from "../providers/supabase-auth-provider";
//import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './App.css'
type TrainerModalProps = {
  handleCloseModel: any;
  trainer: any;
  isLike: boolean;
  setIsGetMore: React.Dispatch<React.SetStateAction<boolean>>;
  setRegenerateLikedTrainers: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserManager: React.FC<TrainerModalProps> = ({
  handleCloseModel,
  setIsGetMore,
  isLike,
  trainer,
  setRegenerateLikedTrainers,
}) => {
  const [trainerPics, setTrainerPics] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [like, setLiked] = useState(isLike);
  const { user } = useAuth();
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  useEffect(() => {
    // Fetch tags
    const fetchTags = async () => {
      const response = await fetch(`/api/tags/${trainer.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setChipData(data.map((item, index) => ({
          label: item.tag,
          key: index
        })));
      }
    }

    fetchTags();
  }, [trainer]);

  useEffect(() => {
    const getImages = async () => {
      // Fetch images with their order from the server
      const response = await fetch(`/api/orderImages/${trainer.id}`);
      const data = await response.json();
      // Sort images by order
      data.sort((a, b) => a.image_order - b.image_order);
      // Extract URLs to set the trainerPics state
      const urls = data.map((image) => image.image_url);
      setTrainerPics(urls);
    };
    getImages();
  }, [trainer]);

  const likeTrainer = async () => {
    setRegenerateLikedTrainers(true);
    const trainer_id = trainer.id;
    const method = like ? "DELETE" : "POST";
    
    const res = await fetch(`/api/like`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trainer_id }),
    });
    if (res.ok) {
      console.log("Successfully toggled like status for the trainer");
      setLiked(!like); // Toggle liked status after successfully liking/unliking the trainer
      setIsGetMore(true); // Refresh liked trainers after liking/unliking a trainer
    } else {
      console.error("Error toggling like status for the trainer");
    }
  };

  // Define HeartIcon component
  const HeartIcon = () =>
    user &&
    user.id != trainer.id && (
      <svg
        onClick={likeTrainer}
        className="w-5 h-5 cursor-pointer"
        fill={like ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        ></path>
      </svg>
    );

    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-60"
            style={{ backdropFilter: "blur(5px)" }}
            onClick={handleCloseModel}
          >
            {" "}
          </div>
          <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto">
            <article className="px-6 py-6 lg:px-8 text-white flex flex-col justify-between h-full">
              <button
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={handleCloseModel}
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
            </svg>              </button>
              {trainer ? (
              <>
                <h3>
                  {trainer.display_name ? trainer.display_name : "Unknown"}
                </h3>
                <HeartIcon />
                <div className="overflow-y-auto" id="custom-scrollbar">
                  {" "}
                  {/* This div will scroll */}
                  <div className="relative w-full overflow-hidden h-96 rounded-lg">
                    <Carousel images={trainerPics}/>
                    <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs font-semibold rounded px-2 py-1">
                  <p className="">
                  {
                      (trainer.price_range_start && trainer.price_range_end) 
                      ? `$${trainer.price_range_start} - $${trainer.price_range_end}` 
                      : (trainer.price_range_start 
                        ? `$${trainer.price_range_start}` 
                        : "")
                  }
                  </p>
                </div>
                  </div>
                  {chipData.map(data => (
                  <div key={data.key} className="mb-0 mt-3 mr-2 inline-block">
                    <div className="flex items-center bg-gray-200 rounded-full text-sm font-medium px-2 py-0.5 whitespace-nowrap">
                      <div className="text-gray-700">{data.label}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex flex-col space-y-2">
                  
                    {trainer.location && (
                      <p>
                        <span className="font-bold">Location:</span>{" "}
                        {trainer.location}
                      </p>
                    )}
                    {trainer.phone_number > 1 && trainer.phone_number.toString().length > 10 &&  (
                      <p>
                        <span className="font-bold">Phone Number:</span>{" "}
                        {trainer.phone_number.toString().replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4")}
                      </p>
                    )}
                    {trainer.yoe && (
                      <p>
                        <span className="font-bold">Years of Experience:</span>{" "}
                        {trainer.yoe}
                      </p>
                    )}
                  </div>
                  {trainer.bio && (
                    <div
                      style={{
                        maxHeight: isReadMore ? "100px" : "200px",
                        overflowY: "auto",
                      }}
                    >
                      <p className={isReadMore ? "line-clamp-3" : ""}>
                        {trainer.bio}
                      </p>
                      {trainer.bio.length > 150 && (
                        <button
                          onClick={toggleReadMore}
                          className="text-blue-500 underline"
                        >
                          {isReadMore ? "...read more" : " show less"}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center mb-2">
                    {trainer.website && trainer.website !== "" && (
                      <div className="mr-2">
                        {" "}
                        {/* Add some right margin for spacing between icons */}
                        <a
                          href={`${trainer.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                            style={{ cursor: "pointer" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.1V5a2 2 0 002 2h2a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.064V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                    {trainer.instagram && (
                      <div style={{ display: "inline-block" }}>
                        <Image
                          src="/instagram.svg"
                          alt="Instagram Icon"
                          width={24}
                          height={24}
                          onClick={() =>
                            window.open(
                              `https://instagram.com/${trainer.instagram}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <h3>Loading...</h3>
            )}
          </article>
        </div>
      </div>
    </>
  );
};

export default UserManager;
