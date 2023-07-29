//handle a put request where the trainer id is sent to you
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let requestData = await request.json()
    if (!requestData) {
        return new NextResponse('Bad request', { status: 400 })
    }

    const supabase = createClient();

    // Fetch the Current User
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    // If there is no user, return 401 Unauthorized
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user_id = session.user.id;
    const trainer_id = requestData.trainer_id;
    if (user_id == trainer_id) {
        return new NextResponse("You can't like yourself", { status: 403 });
    }

const { data, error } = await supabase
  .from('liked_trainers')
  .insert([
    { user_id: user_id, trainer_id: trainer_id },
  ])
  .select()

    return new NextResponse(requestData, { status: 200 });

}
  
export async function GET(request: Request) {
    const supabase = createClient();

    // Fetch the Current User
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    // If there is no user, return 401 Unauthorized
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

let { data: liked_trainers, error } = await supabase
  .from('liked_trainers')
  .select("trainer_id")
  .eq('user_id', session.user.id);


    if (error) {
        return new NextResponse(error.message, { status: 500 });
    }
    if(!liked_trainers){
        return new NextResponse("No liked trainers", { status: 200 });
    }
    let trainer_ids = liked_trainers.map(trainer => trainer.trainer_id);
    let finalData = {"result": trainer_ids};
    return new NextResponse(JSON.stringify(finalData), { status: 200 });
}

export async function DELETE(request: Request) {
  const supabase = createClient();

  // Fetch the Current User
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no user, return 401 Unauthorized
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Parse request data
  let requestData = await request.json();
  if (!requestData) {
    return new NextResponse('Bad request', { status: 400 })
  }

  // Extract trainer_id from requestData
  const trainer_id = requestData.trainer_id;
  
  // Delete the record
  const { data, error } = await supabase
    .from('liked_trainers')
    .delete()
    .eq('user_id', session.user.id)
    .eq('trainer_id', trainer_id);

  // Check for error after deletion
  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  // If everything is fine, return a successful response
  return new NextResponse(JSON.stringify({ message: 'Successfully deleted' }), { status: 200 });
}
