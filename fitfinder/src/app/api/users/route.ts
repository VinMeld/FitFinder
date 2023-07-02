'use server'
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";

import { supabase } from "../../../../lib/supabaseClient";

//get user profile
export async function GET(request: Request) {
  const supabase = createClient();

  // Fetch the Current User
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no user, return 401 Unauthorized
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch Posts for the current user
  const { data: user, error } = await supabase
    .from("users")
    .select("*");

  if(user){
    console.log("user is trainer")
    if(!(user["0"]["isuser"])){
      const { data: trainer, error } = await supabase
      .from("trainer")
      .select("*")
      .eq('id', user["0"]["id"]);
  
      if (error) {
        return new Response(error.message, { status: 500 });
      }
      //create new json
      let allData = {user: user["0"], trainer: trainer["0"]};
      return NextResponse.json(allData, {status: 200});
    }
  }
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return NextResponse.json(user["0"]);
}

