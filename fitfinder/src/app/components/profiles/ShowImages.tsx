import { useEffect, useState } from 'react';
import { useAuth } from '../providers/supabase-auth-provider';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { createClient } from "../../utils/supabase-browser";

const ShowImages = ({uploadCount}) => {
  const { user } = useAuth();
  const supabase = createClient();
  const [images, setImages] = useState<{id: string, url: string, order: number}[]>([]);

  const sendPutRequest = async (updatedOrder) => {
    const response = await fetch('/api/orderImages', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOrder)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const sendDeleteRequest = async (image_url) => {
    const response = await fetch('/api/orderImages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const getOrderImages = async () => {
    const response = await fetch('/api/orderImages');
    const data = await response.json();
    return data;
  }

  const deleteImage = async (filePath) => {
    console.log(filePath)
    const { error } = await supabase.storage.from('trainer-images').remove([filePath]);

    if (error) {
      console.error('Error deleting image: ', error.message);
      return;
    }

    // If successfully deleted, update the local state
    setImages(images.filter(image => image.id !== filePath.split('/').pop()));

    // And delete it from the database
    const urlID = filePath.split('/').pop();
    await sendDeleteRequest(urlID);
  };

  useEffect(() => {
    async function getImages() {
      if (!user) return;
      const { data: images, error: listError } = await supabase.storage.from('trainer-images').list(`${user.id}/`);

      if (listError) {
        console.error('Error getting images: ', listError.message);
        return;
      }

      // Fetch image order from the database
      const orderedImages = await getOrderImages();

      const imageUrls = images.map((image) => {
        const filePath = `${user.id}/${image.name}`;
        try {
          const { data } = supabase.storage.from('trainer-images').getPublicUrl(filePath);
          // Find the order of the image in orderedImages, default to end of array
          const order = orderedImages.find(orderedImage => orderedImage.image_url === image.name)?.order || images.length;
          return { id: image.name, url: data?.publicUrl, order }; // use original file name as id
        } catch(error) {
          console.error('Error getting public URL: ', error);
        }
      }).filter(image => image?.url !== undefined) as {id: string, url: string, order: number}[];

      // Sort images by order
      imageUrls.sort((a, b) => a.order - b.order);
      setImages(imageUrls);
    }
    getImages();
  }, [user, uploadCount]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update state
    setImages(items);

    // Update database
    const updatedOrder = items.map((item, index) => ({
      image_url: item.id,  // assuming item.id is the image_url
      order: index + 1  // new order, starting from 1
    }));
    await sendPutRequest(updatedOrder);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-3 gap-4">
        {images.map(({ id, url }, index) => (
          <Draggable key={id} draggableId={id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                className="m-2 p-2 shadow-lg rounded-lg relative flex justify-center">
                <div className="relative">
                  <Image src={url} alt="User uploaded image" width={500} height={500} key={url} loading="lazy" />
                  <button onClick={() => deleteImage(`${user.id}/${id}`)} 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">X</button>
                </div>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
        </div>
      )}
      </Droppable>
    </DragDropContext>
  );
}

export default ShowImages;
