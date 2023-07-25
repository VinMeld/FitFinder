//handle a put request where the trainer id is sent to you
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let requestData = await request.json()
    console.log(requestData);
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

    console.log(user_id, trainer_id);

const { data, error } = await supabase
  .from('liked_trainers')
  .insert([
    { user_id: user_id, trainer_id: trainer_id },
  ])
  .select()

  console.log("data, error");
  console.log(data, error);

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
    console.log(trainer_ids);
    let finalData = {"result": trainer_ids};
    return new NextResponse(JSON.stringify(finalData), { status: 200 });

}