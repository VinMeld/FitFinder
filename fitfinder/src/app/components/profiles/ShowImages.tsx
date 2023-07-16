import { useEffect, useState } from 'react';
import { useAuth } from '../providers/supabase-auth-provider';
import Image from 'next/image';
import { supabase } from '../../../../lib/supabaseClient'

const ShowImages = () => {
  const { user } = useAuth();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function getImages(){
        // Get list of images
        const { data: images, error: listError } = await supabase.storage.from('avatars').list(`${user.id}/`);
        if(listError) {
            console.error('Error getting images: ', listError.message);
            return;
        }

        const urls = images.map(image => {
            const filePath = `${user.id}/${image.name}`;
            try {
                const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                return data?.publicUrl;
            } catch(error) {
                console.error('Error getting public URL: ', error);
            }
        }).filter(url => url !== undefined) as string[];

        setImageUrls(urls);
    }

    getImages();
  }, []);

  return (
    <div>
        {imageUrls.map(url => 
            url && <Image src={url} alt="User uploaded image" width={500} height={500} key={url} />
        )}
    </div>
  )
}

export default ShowImages;