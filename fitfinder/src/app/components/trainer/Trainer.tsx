import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import { supabase } from '../../../../lib/supabaseClient'
export default function Trainer({onClick, ...props}) {
    const [profilePic, setProfilePic] = useState("");
    useEffect(() => {
      setProfilePic(props.image_url)
    }, [props]);

    return (
    <a onClick={onClick} className="rounded overflow-hidden shadow-lg flex flex-col items-center ">
      <div className="w-full h-0 overflow-hidden relative" style={{paddingTop: '75%'}}>
          {profilePic ? 
              <Image 
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full" 
                  src={profilePic} 
                  alt="Person" 
              /> : 
              <Image 
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full" 
                  src='/coinbase.png' 
                  alt="Person" 
              />
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
