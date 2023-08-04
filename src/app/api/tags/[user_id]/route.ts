import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { log } from 'next-axiom'
type Props = {
    params: {
        user_id: string
    }
}
export async function GET(request: Request, { params: { user_id } }: Props) {
    const supabase = createClient();
  
    // Fetch tags for the provided user_id
    const { data, error } = await supabase
      .from('tags')
      .select('tag')
      .eq('user_id', user_id);
  
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  
    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
     },
  });
}

export async function POST(request: Request, { params: { user_id } }: Props) {
    const { tag } = await request.json();
    const supabase = createClient();
    console.log("TRYING TO ADD A NEW TAG", tag)
    
    // If tag is not provided, return 400 Bad Request
    if (!tag) {
      return new Response("Tag is required", { status: 400 });
    }

    // Fetch current tags of the user
    const { data: currentTags, error: fetchError } = await supabase
      .from('tags')
      .select()
      .eq('user_id', user_id);

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }

    // Check the count of current tags
    if (currentTags.length >= 3) {
      return new Response("A trainer can have maximum 3 tags", { status: 400 });
    }

    // Insert new tag
    const { data, error } = await supabase
      .from('tags')
      .insert({ user_id, tag });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
}
  
  export async function DELETE(request: Request, { params: { user_id } }: Props) {
    const { tag } = await request.json();
    const supabase = createClient();
    console.log(tag)
    console.log("TRYING TO DELETE A TAG", tag)
    console.log(user_id)
    // If tag is not provided, return 400 Bad Request
    if (!tag) {
      return new Response("Tag is required", { status: 400 });
    }
  
    // Delete tag
    const { data, error } = await supabase
      .from('tags')
      .delete()
      .eq('user_id', user_id)
      .eq('tag', tag);
  
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  
    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  

