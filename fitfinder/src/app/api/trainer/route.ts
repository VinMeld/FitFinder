import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'


export async function GET(request: Request) {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL, KEY);

  const { data: trainers, error: trainersError } = await supabaseAdminClient
    .from('trainer')
    .select('*')  // Replace ... with other columns from trainer table you need

  if (trainersError) {
    return new NextResponse(trainersError.message, { status: 500 });
  }

  const { data: images, error: imagesError } = await supabaseAdminClient
    .from('imageOrder')
    .select('user_id, image_url, order')
    .eq('order', 1);
  if (imagesError) {
    console.log("ERRROR")
    return new NextResponse(imagesError.message, { status: 500 });
  }

  const imageMap = images.reduce((acc, image) => ({ ...acc, [image.user_id]: image }), {});

  const result = trainers.map(trainer => {
    const image = imageMap[trainer.id];
    return image ? { ...trainer, imageOrder: image } : trainer;
  });
  console.log("result", result)

  return NextResponse.json(result);
}
