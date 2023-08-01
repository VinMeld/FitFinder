import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Trainer({ key, onClick, ...props }) {
  const [profilePic, setProfilePic] = useState("");
  const [chipData, setChipData] = useState([]);
  useEffect(() => {
    setProfilePic(props.image_url);
    const fetchTags = async () => {
      try {
        const response = await fetch(`/api/tags/${props.id}`);
        if (response.status === 200) {
          const data = await response.json();
          setChipData(data.map((item, index) => ({
            label: item.tag,
            key: index
          })));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchTags();
  }, [props.image_url, props.id]);

  return (
    <a
      onClick={onClick}
      className="group rounded overflow-hidden shadow-lg flex flex-col items-center relative"
    >
      <div
        className="w-full h-0 overflow-hidden relative shadow-2xl transform group-hover:scale-105 transition-transform duration-200"
        style={{ paddingTop: "75%" }}
      >
        {profilePic && (
          <Image
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
            src={profilePic}
            alt="Person"
          />
        )}
        {props.price_range_start && props.price_range_end && (
          <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs font-semibold rounded px-2 py-1">
            ${props.price_range_start} - ${props.price_range_end}
          </div>
        )}

        {chipData && chipData.length > 0 && (
          <div className="hidden group-hover:flex flex-wrap justify-end absolute bottom-2 right-4 rounded-lg p-2">
            {chipData.map(data => (
              <div key={data.key} className="mb-0 mt-1 mr-1 inline-block">
                <div className="flex items-center bg-gray-200 rounded-full text-sm font-medium px-2 py-0.5 whitespace-nowrap">
                  <div className="text-gray-700">{data.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="font-bold text-xl mb-2 text-center text-white">
          {props.display_name}
        </div>
        <p className="text-gray-700 text-base text-center mb-4">
          {props.description}
        </p>
      </div>
    </a>
  );
}
