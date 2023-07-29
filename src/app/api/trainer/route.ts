import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'


export async function GET(request: Request) {
  const supabase = createClient();
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL, KEY);

  let idToDisplayNameMap: Record<string, string> = {};

  let { data: trainers, error: trainersError } = await supabase.from("trainer").select("*");
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });

  const { data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id');
  if (usersError) return new NextResponse(usersError.message, { status: 500 });

  users?.forEach(user => idToDisplayNameMap[user.id] = user.display_name);

  trainers?.forEach(trainer => {
    trainer.display_name = idToDisplayNameMap[trainer.id] || 'Not Found';
  });
  
  const { data: images, error: trainerImagesError } = await supabaseAdminClient
    .from('imageOrder')
    .select('user_id, image_url, image_order')
    .eq('image_order', 1);


    let updatedTrainers = trainers.map(trainer => {
      const imageObject = images.find(image => image.user_id === trainer.id);
      return imageObject ? {...trainer, image_url: imageObject.image_url} : trainer;
    });
  
    updatedTrainers = updatedTrainers.filter(trainer => 'image_url' in trainer);

  if (usersError) return new NextResponse(usersError.message, { status: 500 });
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });
  if (trainerImagesError) return new NextResponse(trainerImagesError.message, { status: 500 });


  return NextResponse.json(updatedTrainers);
}
