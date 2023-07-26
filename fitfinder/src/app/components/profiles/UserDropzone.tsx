import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from "../../utils/supabase-browser";
import { useAuth } from '../providers/supabase-auth-provider';
import ShowImages from './ShowImages';
import {v4 as uuidv4} from 'uuid';
const UserDropzone = (props: any) => {
  const { user } = useAuth();
  const [uploadCount, setUploadCount] = useState(0); 
  const supabase = createClient();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        alert("You can only upload up to 5 files at a time.");
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

          // Continue processing with oldFiles...
      
      } catch (error: any) {
          console.error('Error occurred while listing files: ', error.message);
      
          // Here you could assume that if an error occurred, then it's because there were no files.
          // Then, you can safely continue with your upload or other operation.
      }      
      if ((oldFiles.length + acceptedFiles.length) > 5) {
        alert('You have reached the maximum number of uploads (5).');
        return;
      }
      for(const file of acceptedFiles){
        const filePath = `${user.id}/${uuidv4()}`; // File path in Supabase storage
        try {
          const { data, error } = await supabase.storage.from('trainer-images').upload(filePath, file);
      
          if (error) {
            console.error('Error uploading file: ', error.message);
            continue;
          }
      
          // Wait for a while before checking if the upload was successful
          await new Promise(resolve => setTimeout(resolve, 2000));  // wait for 2 seconds
      
          // Upload Confirmation
          const { data: newFiles, error: confirmError } = await supabase.storage.from('trainer-images').list(userFolderPath);
      
          if (confirmError) {
            console.error('Error confirming upload: ', confirmError.message);
            continue;
          }
      
          const newFile = newFiles.find(f => f.name === file.name);
      
          if (!newFile) {
            console.error(`Uploaded file ${file.name} not found.`);
          } else {
            console.log("File uploaded successfully!");
          }
        } catch (error) {
          console.error('Unexpected error uploading file: ', error);
        }
      }
      setUploadCount(uploadCount => uploadCount + 1);
          },
  });
  return (
    <div {...getRootProps()} className={props.className}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
      {props.children}
      <ShowImages uploadCount={uploadCount}/>
    </div>
  )
}

export default UserDropzone;
