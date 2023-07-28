
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
//import Carousel from './Carousel'
import { useAuth } from '../providers/supabase-auth-provider'; 
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

type TrainerModalProps = {
    handleCloseModel: any;
    trainer: any;
    isLike: boolean;
    setIsGetMore: React.Dispatch<React.SetStateAction<boolean>>;
    setRegenerateLikedTrainers: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserManager: React.FC<TrainerModalProps> = ({handleCloseModel, setIsGetMore, isLike, trainer, setRegenerateLikedTrainers}) => {
    const [trainerPics, setTrainerPics] = useState([]);
    const [like, setLiked] = useState(isLike)
    const { user } = useAuth();
    useEffect(() => {
        const getImages = async () => {
            console.log(trainer.id)
            // Fetch images with their order from the server
            const response = await fetch(`/api/orderImages/${trainer.id}`);
            console.log(response)
            const data = await response.json();
            console.log(data)
            // Sort images by order
            data.sort((a, b) => a.image_order - b.image_order);
            // Extract URLs to set the trainerPics state
            const urls = data.map(image => image.image_url);
            setTrainerPics(urls);
        }
        getImages();
    }, [trainer]);

    
    const likeTrainer = async () => {
        setRegenerateLikedTrainers(true);
        const trainer_id = trainer.id;
        const method = like ? 'DELETE' : 'POST';
        console.log(trainer.id)
        const res = await fetch('http://localhost:3000/api/like', {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({trainer_id})
          });
        if (res.ok) {
            console.log('Successfully toggled like status for the trainer');
            setLiked(!like); // Toggle liked status after successfully liking/unliking the trainer
            setIsGetMore(true); // Refresh liked trainers after liking/unliking a trainer
        } else {
            console.error('Error toggling like status for the trainer');
            }
    };

    // Define HeartIcon component
    const HeartIcon = () => (
        user ? user.id != trainer.id &&
        <svg onClick={likeTrainer} className="w-5 h-5 cursor-pointer" fill={like ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        :
        <svg onClick={likeTrainer} className="w-5 h-5 cursor-pointer" fill={like ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
    );

      return (
    <>
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-black opacity-60" style={{ backdropFilter: 'blur(5px)' }} onClick={handleCloseModel} > </div>
        <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700" >
                <button onClick={handleCloseModel} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                    { trainer ?
                        <>
                            <h3 className="text-white">{trainer.display_name}</h3>
                            <HeartIcon />
                        </>
                        :
                        <h3 className="text-white">Loading...</h3>
                    }
                    {trainerPics && trainerPics.length > 0 &&
                    <div className="relative w-full overflow-hidden h-96 rounded-lg">
                    <Carousel dynamicHeight emulateTouch showThumbs={false}>
                        {trainerPics.map((src, index) => (
                            <div key={index} className="w-full h-full">
                                <Image src={src} height={200} width={200} alt={`Carousel slide ${index}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                }
                </div>
            </div>
        </div>
    </>
  )
}

export default UserManager;