import React from 'react';
import { useDropzone } from 'react-dropzone';

const UserDropzone = (props: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      // Do something with the files
    },
  });

  return (
    <div {...getRootProps()} className={props.className}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      {props.children}
    </div>
  )
}

export default UserDropzone;
