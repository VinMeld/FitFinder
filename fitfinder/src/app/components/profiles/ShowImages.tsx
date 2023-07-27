import { useEffect, useState } from 'react';
import { useAuth } from '../providers/supabase-auth-provider';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { createClient } from "../../utils/supabase-browser";

const ShowImages = ({uploadCount}) => {
  const { user } = useAuth();
  const supabase = createClient();
  const [images, setImages] = useState<{id: string, url: string}[]>([]);
    const deleteImage = async (filePath) => {
    console.log(filePath)
    const { error } = await supabase.storage.from('trainer-images').remove([filePath]);

    if (error) {
        console.error('Error deleting image: ', error.message);
        return;
    }
    console.log(images)
    // If successfully deleted, update the local state
    setImages(images.filter(image => image.id !== filePath.split('/').pop()));
    };

  useEffect(() => {
    async function getImages() {
      if (!user) return;
      const { data: images, error: listError } = await supabase.storage.from('trainer-images').list(`${user.id}/`);
  
      if (listError) {
        console.error('Error getting images: ', listError.message);
        return;
      }
  
      const imageUrls = images.map((image) => {
        const filePath = `${user.id}/${image.name}`;
        try {
          const { data } = supabase.storage.from('trainer-images').getPublicUrl(filePath);
          return { id: image.name, url: data?.publicUrl }; // use original file name as id
        } catch(error) {
          console.error('Error getting public URL: ', error);
        }
      }).filter(image => image?.url !== undefined) as {id: string, url: string}[];
  
      setImages(imageUrls);
    }
  
    getImages();
  }, [user, uploadCount]);
  
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
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
                        <button onClick={() => {
                            console.log("Delete image")
                            const urlID = url.split('/').pop();
                            deleteImage(`${user.id}/${urlID}`)
                        }} 
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
