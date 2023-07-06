import React from 'react'
import Image from 'next/image'
export default function Trainer(props: any) {
    console.log(props)
    return (
    <a href="/trainerDetails" className="rounded overflow-hidden shadow-lg flex flex-col items-center ">
        <div className="w-full h-64 relative overflow-hidden">
          {props.src  ? 
          <Image className="block w-full h-40" width="320" height="160" loading="lazy" src={props.src} alt="Person" />          
          : 
          <Image className="block w-full h-40" width="320" height="160" loading="lazy" src='/coinbase.png' alt="Person" />          
          }
        </div>
        <div className="w-full">
          <span className="inline-block bg-pink-200 text-white rounded-full px-2 py-1 text-xs font-bold mb-2">#photography</span>
        </div>
        <div className="w-full">
          <div className="font-bold text-xl mb-2 text-center">{props.first_name} {props.last_name}</div>
          <p className="text-gray-700 text-base text-center mb-4">
            {props.description}
          </p>
        </div>
      </a>
    )
  }
