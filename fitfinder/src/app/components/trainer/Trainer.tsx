import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import { supabase } from '../../../../lib/supabaseClient'
export default function Trainer({onClick, ...props}) {
    const [profilePic, setProfilePic] = useState("");
    useEffect(() => {
      const getImages = async () => {
        // Get list of images
        if (!props) return;
        const { data: images, error: listError } = await supabase.storage.from('trainer-images').list(`${props.id}/`);
        if(listError) {
            console.error('Error getting images: ', listError.message);
            return;
        }

        const urls = images.map(image => {
            const filePath = `${props.id}/${image.name}`;
            try {
                const { data } = supabase.storage.from('trainer-images').getPublicUrl(filePath);
                return data?.publicUrl;
            } catch(error) {
                console.error('Error getting public URL: ', error);
            }
        }).filter(url => url !== undefined) as string[];
        if(urls.length > 0) {
          setProfilePic(urls[0]);
        }
      }
      getImages();
    }, [props]);

    return (
    <a onClick={onClick} className="rounded overflow-hidden shadow-lg flex flex-col items-center ">
        <div className="w-full h-64 relative overflow-hidden">
          {profilePic  ? 
          <Image className="block w-full h-40" width="320" height="160" loading="lazy" src={profilePic} alt="Person" />          
          : 
          <Image className="block w-full h-40" width="320" height="160" loading="lazy" src='/coinbase.png' alt="Person" />          
          }
        </div>
        <div className="w-full">
          <div className="font-bold text-xl mb-2 text-center text-white">{props.display_name}</div>
          <p className="text-gray-700 text-base text-center mb-4">
            {props.description}
          </p>
        </div>
      </a>
    )
  }
