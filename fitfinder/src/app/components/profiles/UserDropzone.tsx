import React, {useEffect, useState, useRef} from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from "../../utils/supabase-browser";
import { useAuth } from '../providers/supabase-auth-provider';
import {v4 as uuidv4} from 'uuid';
import AvatarEditor from 'react-avatar-editor';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDropzone = (props: any) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const editorRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1.2);

  const supabase = createClient();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        toast.error("You can only upload up to 5 files at a time.");
        return;
      }
      if (!user) return;
      const userFolderPath = `${user.id}/`;  // Path where user's files are stored
      console.log(userFolderPath)
      let oldFiles = [];
      try {
          const { data: oldFiles1, error: listError } = await supabase.storage.from('trainer-images').list(userFolderPath);
          oldFiles = oldFiles1 || [];
          if (listError) {
              console.error('Error listing files: ', listError.message);
              return;
          }
          console.log("oldFiles1", oldFiles1)

      
      } catch (error: any) {
          console.error('Error occurred while listing files: ', error.message);
      }      
      if ((oldFiles.length + acceptedFiles.length) > 5) {
        toast.error('You have reached the maximum number of uploads (5).');
        return;
      }
      
      for(const file of acceptedFiles) {
        setImage(file);
        setShowModal(true);
      }
    },
  });

  const postImageOrder = async (filePath) => {
    const response = await fetch('/api/orderImages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{image_url: filePath, order: 1}])
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
      const data = await response.json();
      console.log(data);
    }
}

  const handleSave = async () => {
    const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
    const response = await fetch(canvas);
    const blob = await response.blob();
    const file = new File([blob], "filename", { type: 'image/png' });
    const filePath = `${user.id}/${uuidv4()}`; // File path in Supabase storage
    const userFolderPath = `${user.id}/`;  // Path where user's files are stored
    try {
      const { data, error } = await supabase.storage.from('trainer-images').upload(filePath, file);
      if (error) {
        console.error('Error uploading file: ', error.message);
      } else if (data) {
        console.log("File uploaded successfully!");
        toast.success("File uploaded successfully!");
        postImageOrder(filePath);
      }
      // Wait for a while before checking if the upload was successful
      await new Promise(resolve => setTimeout(resolve, 2000));  // wait for 2 seconds
  
      // Upload Confirmation
      const { data: newFiles, error: confirmError } = await supabase.storage.from('trainer-images').list(userFolderPath);
  
      if (confirmError) {
        console.error('Error confirming upload: ', confirmError.message);
      }
      const newFile = newFiles.find(f => f.name === file.name);
      if (!newFile) {
        console.error(`Uploaded file ${file.name} not found.`);
        toast.error("Uploaded file not found.");
      } else {
        console.log("File uploaded successfully!");
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error('Unexpected error uploading file: ', error);
      toast.error("Unexpected error uploading file.");
    }
    props.setUploadCount(uploadCount => uploadCount + 1);
    setImage(null);
    setShowModal(false);
  }

  return (
    <>
    <ToastContainer />
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-60" style={{ backdropFilter: 'blur(5px)' }} onClick={() => setShowModal(false)}></div>
        <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
          <button onClick={() => setShowModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            {image && (
              <div>
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={250}  // reduced for a smaller display
                  height={250}  // reduced for a smaller display
                  border={50}
                  scale={zoom}
                />
                <div style={{ marginTop: '1em' }}>
                  <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
                </div>
                <button 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '10px', 
                    background: '#007BFF', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    marginTop: '1em' 
                  }} 
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    <div {...getRootProps()} className={props.className}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
      {props.children}
    </div>
    </>
  )
}

export default UserDropzone;
