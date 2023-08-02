import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { log } from 'next-axiom'
type Props = {
    params: {
        trainer_id: string
    }
}
export async function DELETE(request: Request, { params: { trainer_id } }: Props) {
    const supabase = createClient();
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    let requestData = await request.json();
    if (!requestData) {
      return new NextResponse('Bad request', { status: 400 })
    }
  
    const { data, error } = await supabase
      .from('ratings')
      .delete()
      .eq('user_id', session.user.id)
      .eq('trainer_id', trainer_id);
  
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }
  
    return new NextResponse(JSON.stringify({ message: 'Successfully deleted' }), { status: 200 });
  }
  
  export async function PUT(request: Request, { params: { trainer_id } }: Props) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    let requestData = await request.json();
    if (!requestData) {
      return new NextResponse('Bad request', { status: 400 })
    }
  
    const new_rating = requestData.rating;
    
    const { data, error } = await supabase
      .from('ratings')
      .update({ rating: new_rating })
      .eq('user_id', session.user.id)
      .eq('trainer_id', trainer_id);
  
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }
  
    return new NextResponse(JSON.stringify({ message: 'Successfully updated' }), { status: 200 });
  }

export async function POST(request: Request, { params: { trainer_id } }: Props) {
    let requestData = await request.json()
    if (!requestData) {
        return new NextResponse('Bad request', { status: 400 })
    }
    const supabase = createClient();
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    const user_id = session.user.id;
    const rating = requestData.rating;
  
    const { data, error } = await supabase
      .from('ratings')
      .insert([
        { user_id: user_id, trainer_id: trainer_id, rating: rating },
      ])
      .select();
  
    return new NextResponse(requestData, { status: 200 });
  }
  
  export async function GET(request: Request, { params: { trainer_id } }: Props) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let { data: ratings, error } = await supabase
      .from('ratings')
      .select("*")
      .eq('user_id', session.user.id)
      .eq('trainer_id', trainer_id);
      if (error) {
      return new NextResponse(error.message, { status: 500 });
    }
    if(ratings.length == 0){
      return new NextResponse("None found", { status: 404 });
    }
    return new NextResponse(JSON.stringify(ratings[0]), { status: 200 });
  }
  