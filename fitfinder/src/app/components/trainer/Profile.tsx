import React from 'react'
import Image from 'next/image'
const ProfileInfo = () => {
    const items = ["Item 1", "Item 2", "Item 3"]; // Replace with your actual items
  return (
    <>
    <div className="bg-black-gradient-2 rounded-lg divide-y divide-gray-500 space-y-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 py-4 px-6 hover:bg-blue-gradient text-white"
        >
          {item}
        </div>
      ))}
    </div>
    </>
  );
}

export default ProfileInfo