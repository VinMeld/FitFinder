import React from 'react'
import Image from 'next/image'
export default function Trainer() {
    return (
    <a href="/trainerDetails" className="rounded overflow-hidden shadow-lg flex flex-col items-center ">
        <div className="w-full h-64 relative overflow-hidden">
          <Image className="block w-full h-40" width="320" height="160" loading="lazy" src="/Discount.svg" alt="Person" />
        </div>
        <div className="w-full">
          <span className="inline-block bg-pink-200 text-white rounded-full px-2 py-1 text-xs font-bold mb-2">#photography</span>
        </div>
        <div className="w-full">
          <div className="font-bold text-xl mb-2 text-center">The Coldest Sunset</div>
          <p className="text-gray-700 text-base text-center mb-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
          </p>
          <p className="text-sm text-gray-500 text-center">Furnished room in an apartment</p>
        </div>
      </a>
    )
  }
