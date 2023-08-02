import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
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
      .from('comment')
      .delete()
      .eq('id', requestData.comment_id)
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
    
    const new_comment = requestData.comment;
    const fieldsToCheck = ['comment'];

   // Loop over each field to check
    for (let field of fieldsToCheck) {
      // Only proceed if the field is defined
      if (requestData[field]) {
        // Create the search parameters
        const params = new URLSearchParams({
          text: requestData[field],
          token: '4PPpkaxCn=RUoy98/Bd6ZwKfrPM6SCWx/xlUki/Y4HajNRS2NEuLRdt7=FSQWqqo1R/bw67JB=6GD54mlsuDfP6PXEAPFuDTZnx6HGS??mexLlRoN5wZmST4Kd-ZhUHYuIIZy8J-pq9RexTconKgLkv25z7s0QySF=2qaOZf0wd8CnWVtwlQVHs/wVmNHhnQpvrEkDL0OnVoYFAfBauivl8226ro=TZTfs-Q-Ej3sYvlo6116NnjkLNj/hwmX7gw',
        });
        // Set the search parameters on the URL
        const url = new URL('https://ai.fitfinder.ca/classify');
        url.search = params.toString();
        console.log(url);

        // Send a request to the classify API
        const response = await fetch(url.toString());

        // Check if request was successful
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }

        // Parse response as JSON
        const spamData = await response.json();
        console.log(spamData)
        // Check classification value
        if (spamData.classification === true) {
          return new NextResponse(`Please have a kinder ${field}`, { status: 401 });
        }
      }
    }
    const { data, error } = await supabase
      .from('comment')
      .update({ comment: new_comment })
      .eq('id', requestData.comment_id)
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
    const fieldsToCheck = ['comment'];

   // Loop over each field to check
    for (let field of fieldsToCheck) {
      // Only proceed if the field is defined
      if (requestData[field]) {
        // Create the search parameters
        const params = new URLSearchParams({
          text: requestData[field],
          token: '4PPpkaxCn=RUoy98/Bd6ZwKfrPM6SCWx/xlUki/Y4HajNRS2NEuLRdt7=FSQWqqo1R/bw67JB=6GD54mlsuDfP6PXEAPFuDTZnx6HGS??mexLlRoN5wZmST4Kd-ZhUHYuIIZy8J-pq9RexTconKgLkv25z7s0QySF=2qaOZf0wd8CnWVtwlQVHs/wVmNHhnQpvrEkDL0OnVoYFAfBauivl8226ro=TZTfs-Q-Ej3sYvlo6116NnjkLNj/hwmX7gw',
        });
        // Set the search parameters on the URL
        const url = new URL('https://ai.fitfinder.ca/classify');
        url.search = params.toString();
        console.log(url);

        // Send a request to the classify API
        const response = await fetch(url.toString());

        // Check if request was successful
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }

        // Parse response as JSON
        const spamData = await response.json();
        console.log(spamData)
        // Check classification value
        if (spamData.classification === true) {
          return new NextResponse(`Please have a kinder ${field}`, { status: 401 });
        }
      }
    }

    const user_id = session.user.id;
    // Can only comment once 
    const { data: comments, error: fetchError } = await supabase
      .from('comment')
      .select()
      .eq('user_id', user_id)
      .eq('trainer_id', trainer_id);
    if (fetchError) {
      return new NextResponse(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }
    if (comments.length > 0) {
      return new NextResponse("You can only comment once", { status: 401 });
    }
   // Cannot comment on your own profile
    if (user_id === trainer_id) {
      return new NextResponse("You cannot comment on your own profile", { status: 401 });
    }
    const comment = requestData.comment;
    console.log("Comment, trainer_id, user_id")
    console.log(comment, trainer_id, user_id);
    const { data, error } = await supabase
      .from('comment')
      .insert([
        { user_id: user_id, trainer_id: trainer_id, comment: comment },
      ])
      .select()
    if(error) {
      console.log("error", error.message)
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse(requestData, { status: 200 });
  }
  
  export async function GET(request: Request, { params: { trainer_id } }: Props) {
    const supabase = createClient();
    console.log("trainer_id", trainer_id)
    let { data: comments, error } = await supabase
    .rpc('get_comments_with_user', { 'trainer_id': trainer_id });
    console.log("Comments:")
    console.log(comments)
  
    if (error) {
        console.log("error")
        return new NextResponse(error.message, { status: 500 });
    }
  
    return new NextResponse(JSON.stringify(comments), { status: 200 });
  }
  