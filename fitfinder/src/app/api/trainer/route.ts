import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";


import { supabase } from "../../../../lib/supabaseClient";

//get all data from trainer
export async function GET(request: Request) {
  const supabase = createClient();

  // Fetch Posts for the current user
  const { data: trainers, error } = await supabase
    .from("trainer")
    .select("*");
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return NextResponse.json(trainers);
}

