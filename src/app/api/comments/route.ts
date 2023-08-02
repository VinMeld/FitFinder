import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
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
  
    const trainer_id = requestData.trainer_id;
    
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('user_id', session.user.id)
      .eq('trainer_id', trainer_id);
  
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }
  
    return new NextResponse(JSON.stringify({ message: 'Successfully deleted' }), { status: 200 });
  }
  
  export async function PUT(request: Request) {
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
  
    const trainer_id = requestData.trainer_id;
    const new_comment = requestData.comment;
    
    const { data, error } = await supabase
      .from('comments')
      .update({ comment: new_comment })
      .eq('user_id', session.user.id)
      .eq('trainer_id', trainer_id);
  
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }
  
    return new NextResponse(JSON.stringify({ message: 'Successfully updated' }), { status: 200 });
  }

export async function POST(request: Request) {
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
    const trainer_id = requestData.trainer_id;
    const comment = requestData.comment;
  
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { user_id: user_id, trainer_id: trainer_id, comment: comment },
      ])
      .select()
  
    return new NextResponse(requestData, { status: 200 });
  }
  
  export async function GET(request: Request) {
    const supabase = createClient();
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    let { data: comments, error } = await supabase
      .from('comments')
      .select("*")
      .eq('user_id', session.user.id);
  
    if (error) {
        return new NextResponse(error.message, { status: 500 });
    }
    
    return new NextResponse(JSON.stringify(comments), { status: 200 });
  }
  