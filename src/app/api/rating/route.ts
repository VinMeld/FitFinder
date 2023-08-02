import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { URL } from 'url'; // Node.js built-in URL module

export async function GET(request: Request) {
  const supabase = createClient();
  
  // Extract URL parameters
  const url = new URL(request.url);
  const trainer_id = url.searchParams.get('trainer_id');

  if(!trainer_id) return new NextResponse('Bad request', { status: 400 });
  
  let { data: ratings, error } = await supabase
    .from('ratings')
    .select("rating")
    .eq('trainer_id', trainer_id);
  if(!ratings) return new NextResponse('Not rated before', { status: 400 });

  if (error) {
      console.log("error")
    return new NextResponse(error.message, { status: 500 });
  }

  // Calculate the average
  let sum = 0;
  for(let rating of ratings) {
    sum += rating.rating;
  }
  let avgRating = sum / ratings.length;
  console.log(avgRating)
  return new NextResponse(JSON.stringify({avg_rating: avgRating}), { status: 200 });
}
