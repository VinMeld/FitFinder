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
    const { data: images, error } = await supabase
    .from("imageOrder")
    .select("*")
    .eq('user_id', id);
    if (error) {
      console.log("There was an error", error.message);
      return new Response(error.message, { status: 500 });
    }
    return NextResponse.json(images);
}