import React, { useState } from 'react';
import Image from 'next/image';

const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((oldSlide) => {
      return oldSlide === 0 ? images.length - 1 : oldSlide - 1;
    });
  };

  const handleNext = () => {
    setCurrentSlide((oldSlide) => {
      return oldSlide === images.length - 1 ? 0 : oldSlide + 1;
    });
  };

  return (
    <div className="relative w-full overflow-hidden h-96 rounded-lg">
      {images.map((src, index) => (
        <div key={index} className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${index === currentSlide ? 'block duration-700 ease-in-out' : 'hidden'}`}>
          <Image
            width={200}
            height={200}
            className="block w-full"
            src={src}
            alt={`Carousel slide ${index}`}
          />
        </div>
      ))}
      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current={index === currentSlide ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      <button className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
        </svg>
        <span className="sr-only">Previous</span>
      </button>
      <button className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
