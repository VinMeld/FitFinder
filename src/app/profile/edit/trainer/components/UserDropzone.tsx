import React, { useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "../../../../utils/supabase-browser";
import { useAuth } from "../../../../components/providers/supabase-auth-provider";
import { v4 as uuidv4 } from "uuid";
import AvatarEditor from "react-avatar-editor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const UserDropzone = (props: any) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const editorRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1.2);
  const router = useRouter();
  const accept = {
    'image/*': ['png', 'jpg', 'jpeg', 'gif']
  };
  
  const supabase = createClient();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept,
    maxSize: 2 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        toast.error("You can only upload up to 5 files at a time.");
        return;
      }
      if (!user) return;
      const userFolderPath = `${user.id}/`; // Path where user's files are stored
      let oldFiles = [];
      try {
        const { data: oldFiles1, error: listError } = await supabase.storage
          .from("trainer_images")
          .list(userFolderPath);
        oldFiles = oldFiles1 || [];
        if (listError) {
          console.error("Error listing files: ", listError.message);
          return;
        }
      } catch (error: any) {
        console.error("Error occurred while listing files: ", error.message);
      }
      if (oldFiles.length + acceptedFiles.length > 5) {
        toast.error("You have reached the maximum number of uploads (5).");
        return;
      }

      for (const file of acceptedFiles) {
        setImage(file);
        setShowModal(true);
        handleSave(file);
      }
    },
  });

  const postImageOrder = async (publicURL) => {
    const response = await fetch("/api/orderImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: publicURL, order: 1 }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
    }
  };

  const handleSave = async (file) => {
    const filePath = `${user.id}/${uuidv4()}`; // File path in Supabase storage
    try {
      const { data, error } = await supabase.storage
        .from("trainer_images")
        .upload(filePath, file);
      if (error) {
        console.error("Error uploading file: ", error.message);
      } 
      console.log("Okay we got there")
      // Get the URL of the uploaded file
      let { data: tempURL } = supabase.storage
        .from("trainer_images")
        .getPublicUrl(filePath);
      let publicURL = tempURL.publicUrl
      console.log("public url")
      console.log(publicURL)
      // Send the image URL to your backend for NSFW classification
      const response = await fetch('/api/nsfwCheck', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image_url: publicURL })
      });
  
      const dataNew = await response.json();
      console.log(dataNew)
      // If the image is classified as NSFW, delete it from Supabase
      if (dataNew.NSFW_Prob > 0.99) {
        const { error: deleteError } = await supabase.storage
          .from('trainer_images')
          .remove([filePath]);
  
        if (deleteError) {
          throw deleteError;
        }
  
        toast.error("The uploaded image was classified as NSFW and has been deleted.");
        setImage(null);
        setShowModal(false);
        return;
      }
      console.log(publicURL)
      postImageOrder(publicURL);
    } catch (error) {
      console.error("Unexpected error uploading file: ", error);
      toast.error("Unexpected error uploading file.");
    }
    props.setUploadCount((uploadCount) => uploadCount + 1);
    router.refresh();
    setImage(null);
    setShowModal(false);
    toast.success("File uploaded successfully!");
  };
  

  return (
    <>
      <ToastContainer />
      <div {...getRootProps()} className={props.className}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
        {props.children}
      </div>
    </>
  );
};

export default UserDropzone;
