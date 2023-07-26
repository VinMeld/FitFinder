
import React, {useState, useEffect} from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import Image from 'next/image'
import { get } from 'http';

type TrainerModalProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    trainer: any;
}
const UserManager: React.FC<TrainerModalProps> = ({setIsOpen, trainer}) => {
    const [trainerPics, setTrainerPics] = useState([]);
    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        const getLikedTrainers = async () => {
            const res = await fetch('http://localhost:3000/api/like', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
        
            if(res.ok) {
              const data = await res.json();
              setLiked(data); 
              console.log(data);
            } else {
              console.error('Error getting liked trainers');
            }
          }
          getLikedTrainers();
        const getImages = async () => {
            // Get list of images
            if (!trainer) return;
            const { data: images, error: listError } = await supabase.storage.from('trainer-images').list(`${trainer.id}/`);
            if(listError) {
                console.error('Error getting images: ', listError.message);
                return;
            }
            const urls: string[] = [];
            for (const image of images) {
                const filePath = `${trainer.id}/${image.name}`;
                try {
                    const { data, error } = await supabase.storage.from('trainer-images').getPublicUrl(filePath);
                    if (error) throw error;
                    if (data?.publicUrl) urls.push(data.publicUrl);
                } catch(error) {
                    console.error('Error getting public URL: ', error);
                }
            }
            if(urls.length > 0) {
                setTrainerPics(urls);
            }
        }
        getImages();
    }, [trainer]);

    
    const likeTrainer = async () => {
        const res = await fetch('http://localhost:3000/api/like', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(trainer.id)
          });
      
        if (res.ok) {
            console.log('Successfully liked the trainer');
            setLiked(true); // Set liked to true after successfully liking the trainer
            getLikedTrainers();
        } else {
            console.error('Error liking the trainer');
        }
    };

    // Define HeartIcon component
    const HeartIcon = () => (
        <svg onClick={likeTrainer} className="w-5 h-5 cursor-pointer" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
    );

      return (
    <>
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-black opacity-60" style={{ backdropFilter: 'blur(5px)' }} onClick={() => setIsOpen(false)} > </div>
        <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700" >
                <button onClick={() => setIsOpen(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                    { trainer ?
                        <>
                            <h3 className="text-white">{trainer.id} HI </h3>
                            <HeartIcon />
                        </>
                        :
                        <h3 className="text-white">Loading...</h3>
                    }
                       {
                       trainerPics  ? 
                       trainerPics.map((pic, index) => {
                        return (
                        <Image key={index} className="block w-full h-40" width="320" height="160" loading="lazy" src={pic} alt="Person" />          
                        )})
                        : 
                        <Image className="block w-full h-40" width="320" height="160" loading="lazy" src='/coinbase.png' alt="Person" />          
                        }

                </div>
            </div>
        </div>
    </>
  )
}

export default UserManager;