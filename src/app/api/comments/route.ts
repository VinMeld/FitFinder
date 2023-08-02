import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { URL } from 'url'; // Node.js built-in URL module

export async function GET(request: Request) {
  const supabase = createClient();
  
  // Extract URL parameters
  const url = new URL(request.url);
  const trainer_id = url.searchParams.get('trainer_id');
  const user_id = url.searchParams.get('user_id');
  console.log("IN GET REQUEST")
  console.log("trainer_id", trainer_id, "user_id", user_id)

  if(!trainer_id) return new NextResponse('Bad request', { status: 400 });
  let { data: ratings, error } = await supabase
    .from('ratings')
    .select("rating")
    .eq('trainer_id', trainer_id)
    .eq('user_id', user_id);
  if(!ratings) return new NextResponse('Not rated before', { status: 400 });

  if (error) {
      console.log("error getting rating")
    return new NextResponse(error.message, { status: 500 });
  }
  const rating = ratings[0]
  return new NextResponse(JSON.stringify(rating), { status: 200 });
}
