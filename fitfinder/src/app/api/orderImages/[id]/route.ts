'use server'
import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
type Props = {
  params: {
      id: string
  }
}

//get user profile
export async function GET(request: Request, { params: { id } }: Props) {
   const supabase = createClient();
   console.log("Fetching images with id")
   // Fetch images that are equal to the id of the trainer
   console.log(id)
    const { data: images, error } = await supabase
    .from("imageOrder")
    .select("*")
    .eq('user_id', id);
    if (error) {
      console.log("There was an error", error.message);
      return new Response(error.message, { status: 500 });
    }
    console.log("Sending images back")
    return NextResponse.json(images);
}