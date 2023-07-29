'use server'
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";


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

export async function PUT(request: Request) {
  const userColumns = ["first_name", "last_name", "phone_number", "display_name", "email", "location"];
  const trainerColumns = ["yoe", "price_range_start", "price_range_end", "website", "bio", "instagram"];
    console.log("put request")
  //console.log(request)
  const supabase = createClient();

  // Fetch the Current User
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no user, return 401 Unauthorized
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const req = await request.json();
  console.log("req", req)
  

  //respond with body


  console.log(req)

  //loop through json and discard field if its empty

  for(var key in req){
    if(req[key] == ""){
      delete req[key];
    }
  }

  let userReq = {}
  let trainerReq = {}

  // Loop through json and divide fields based on userColumns and trainerColumns
  for(var key in req){
    if(req[key] !== ""){
      if(userColumns.includes(key)) {
        userReq[key] = req[key]
      } 
      else if(trainerColumns.includes(key)) {
        trainerReq[key] = req[key]
      }
    }
  }

  console.log(userReq);
  console.log(trainerReq);


  console.log(req);

  const { data, error } = await supabase
  .from('users')
  .update(userReq)
  .eq('id', session.user.id)
  .select()

  
  const { data: trainerData, error: trainerError  } = await supabase
  .from('trainer')
  .update(trainerReq)
  .eq('id', session.user.id)
  .select()


  console.log(trainerError);
  console.log(trainerData);
  return new NextResponse(JSON.stringify(req), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};