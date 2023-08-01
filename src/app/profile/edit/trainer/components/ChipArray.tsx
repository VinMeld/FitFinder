import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlus } from "react-icons/ai";

export default function ChipsArray(props) {
  const [chipData, setChipData] = useState([]);
  const [newTag, setNewTag] = useState('');
  const MAX_TAG_LENGTH = 20;

  const createNewTag = async (event) => {
    event.stopPropagation()
    if (newTag.length <= MAX_TAG_LENGTH) {
        // Check if the tag is already in the list
        const tagExists = chipData.some(chip => chip.label.toString().toLowerCase() === newTag.toLowerCase());
        
        if (!tagExists) {
          const response = await fetch(`/api/tags/${props.user_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tag: newTag
            })
          });

          if (response.status === 200) {
            setChipData((chips) => [...chips, { key: chips.length, label: newTag }]);
            setNewTag('');
          } else {
            console.log('Could not add tag.');
          }
        } else {
          console.log('Tag already exists.');
        }
    } else {
      console.log(`Tag is too long. Maximum length is ${MAX_TAG_LENGTH} characters.`);
    }
  }

  const handleDelete = useCallback((chipToDelete) => async (event) => {
    event.stopPropagation()
    console.log(chipToDelete)
    console.log("trying to delete ^")
    const response = await fetch(`/api/tags/${props.user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tag: chipToDelete.label
      })
    });

    if (response.status === 200) {
      setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    } else {
      console.log('Could not delete tag.');
    }
  }, [props.user_id]);

  // Fetch tags when the component is first rendered
  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(`/api/tags/${props.user_id}`);
      if (response.status === 200) {
        const data = await response.json();
        setChipData(data.map((item, index) => ({
          label: item.tag,
          key: index
        })));
      }
    }

    fetchTags();
  }, []);

   return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="flex items-center mb-4">
        <label htmlFor="tag" className="block text-sm font-medium text-white mr-2">Tags</label>
        <input
          id="tag"
          value={newTag}
          maxLength={MAX_TAG_LENGTH}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onChange={(e) => setNewTag(e.target.value)}
        />
        {chipData.length < 6 && chipData.every((chip) => chip.label.toString().toLowerCase() !== newTag.toLowerCase()) &&
          <button type="button"  className="p-1 bg-blue-500 hover:bg-blue-700 text-white rounded ml-2" onClick={createNewTag}>
              <AiOutlinePlus />
          </button>
        }
      </div>
      <div className="flex flex-wrap justify-center">
      { 
        chipData.map((data) => {
          return (
            <div key={data.key} className="m-1">
              <div className="flex items-center bg-gray-200 rounded-full text-sm font-medium px-2 py-0.5">
                <div className="text-gray-700">{data.label}</div>
                <button type="button" className="ml-1.5 text-gray-500 hover:text-gray-700" onClick={(event) => handleDelete(data)(event)}>
                &times;
                </button>
              </div>
            </div>
          );
        })
      }
      </div>
    </div>
  );
}
