'use server'
import { createClient as createAdminClient} from '@supabase/supabase-js'
import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase-server";


//get user profile
export async function GET(request: Request) {

    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

    //const supabase = createClient(URL, KEY);

    const supabase = createClient();

    const supabaseAdminClient = createAdminClient(URL, KEY);
  
    // Fetch the Current User
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    // If there is no user, return 401 Unauthorized
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
  
    console.log(session);
    //Fetch Posts for the current user
    const { error:terror } = await supabase
        .from('users')
        .delete()
        .eq('id', session.user.id)

    console.log(terror);

    const { data, error } = await supabaseAdminClient.auth.admin.deleteUser(
        session.user.id
      )
    console.log(error);


    if (error) {
      return NextResponse.json(error.message, { status: 500 });
    }
    //send success message
    return NextResponse.json(data, {status: 200});
  }