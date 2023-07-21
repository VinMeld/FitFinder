import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";

import { createClient as createAdminClient } from '@supabase/supabase-js'


// //get all data from trainer
// export async function GET(request: Request) {
//   const supabase = createClient();

  
//   const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
//   const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

//   const supabaseAdminClient = createAdminClient(URL, KEY);

//   // Fetch Posts for the current user
//   const { data: trainers, error } = await supabase
//     .from("trainer")
//     .select("*");

  


//   let { data: users, error:userError } = await supabaseAdminClient
//   .from('users')
//   .select('display_name, id')

//   if (error) {
//     return new Response(error.message, { status: 500 });
//   }
//   else if (userError) {
//     return new Response(userError.message, { status: 500 });
//   }
//   else {
//     let idToDisplayNameMap = {};
//     if (users == null) {
//         users = [];
//     }
//     // Create a map of id to display name
//     else{
//     for (let item of users) {
//         idToDisplayNameMap[item.id] = item.display_name;
//     }
//   }

//   if (trainers == null) {
    
//   }
//   else{


//     // Add display name to the second array
//     for (let item of trainers) {
//         item.display_name = idToDisplayNameMap[item.id] || 'Not Found';
//     }
//   }
//   }





//   console.log(users);
//   console.log(trainers)


//   return NextResponse.json(trainers);
// }

interface User {
  display_name: string;
  id: string;
}

interface Trainer {
  id: string;
  created_at: string;
  location: string | null;
  yoe: number | null;
  price_range_start: number | null;
  price_range_end: number | null;
  website: string | null;
  bio: string | null;
  instagram: string | null;
  display_name?: string;
}

export async function GET(request: Request) {
  const supabase = createClient();
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL, KEY);

  let idToDisplayNameMap: Record<string, string> = {};

  const { data: trainers, error: trainersError } = await supabase.from("trainer").select("*");
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });

  const { data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id');
  if (usersError) return new NextResponse(usersError.message, { status: 500 });

  users?.forEach(user => idToDisplayNameMap[user.id] = user.display_name);

  trainers?.forEach(trainer => {
    trainer.display_name = idToDisplayNameMap[trainer.id] || 'Not Found';
  });

  console.log(users, trainers);

  return NextResponse.json(trainers);
}
