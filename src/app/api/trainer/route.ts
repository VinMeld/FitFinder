import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { log } from 'next-axiom'

export async function GET(request: Request) {
  const supabase = createClient();
  const URL1 = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL1, KEY);

  const {searchParams} = new URL(request.url);
  const searchQuery = searchParams.get('search');
  
  let users, usersError;
  if(searchQuery) {
    ({ data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id').ilike('display_name', `%${searchQuery}%`));
  } else {
    ({ data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id'));
  }

  if (usersError) return new NextResponse(usersError.message, { status: 500 });
  if (!users || users.length === 0) return new NextResponse('No users found', { status: 404 });

  let userIds = users.map(user => user.id);

  let { data: trainers, error: trainersError } = await supabase.from("trainer").select("*").in('id', userIds);
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });
  if (!trainers) return new NextResponse('No trainers found', { status: 404 });

  let idToDisplayNameMap: Record<string, string> = {};
  users.forEach(user => idToDisplayNameMap[user.id] = user.display_name);

  trainers.forEach(trainer => {
    trainer.display_name = idToDisplayNameMap[trainer.id] || 'Not Found';
  });

  const { data: images, error: trainerImagesError } = await supabaseAdminClient
    .from('imageOrder')
    .select('user_id, image_url, image_order')
    .eq('image_order', 1);

  if (trainerImagesError) return new NextResponse(trainerImagesError.message, { status: 500 });

  let updatedTrainers = trainers.map(trainer => {
    const imageObject = images.find(image => image.user_id === trainer.id);
    return imageObject ? {...trainer, image_url: imageObject.image_url} : trainer;
  });

  updatedTrainers = updatedTrainers.filter(trainer => 'image_url' in trainer);

  return NextResponse.json(updatedTrainers);
}



/*
    console.log(updatedTrainers)
    console.log(searchQuery)
    updatedTrainers = updatedTrainers.filter(trainer => trainer.display_name.toLowerCase().includes(searchQuery.toLowerCase()));

*/