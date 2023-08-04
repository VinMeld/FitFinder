import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
import { isToxic } from "../../utils/spam_api";
type Props = {
  params: {
    trainer_id: string;
  };
};
export async function DELETE(
  request: Request,
  { params: { trainer_id } }: Props
) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let requestData = await request.json();
  if (!requestData) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", requestData.comment_id)
    .eq("user_id", session.user.id)
    .eq("trainer_id", trainer_id);

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return new NextResponse(JSON.stringify({ message: "Successfully deleted" }), {
    status: 200,
  });
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
    return new NextResponse("Bad request", { status: 400 });
  }
  const new_comment = requestData.comment;
  if(new_comment.length > 250 ) {
    return new NextResponse("Comment is too long", { status: 401 });
  }
  const fieldsToCheck = ["comment"];

  // Loop over each field to check
  for (let field of fieldsToCheck) {
    // Only proceed if the field is defined
    if (requestData[field]) {
      // Use the isToxic function to classify the text
      const isToxicText = await isToxic(requestData[field]);

      // Check classification value
      if (isToxicText) {
        console.log("Toxic");
        return new NextResponse(`Please have a kinder ${field}`, {
          status: 401,
        });
      }
    }
  }
  const { data, error } = await supabase
    .from("comment")
    .update({ comment: new_comment })
    .eq("id", requestData.comment_id)
    .eq("user_id", session.user.id)
    .eq("trainer_id", trainer_id);

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return new NextResponse(JSON.stringify({ message: "Successfully updated" }), {
    status: 200,
  });
}

export async function POST(
  request: Request,
  { params: { trainer_id } }: Props
) {
  let requestData = await request.json();
  if (!requestData) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const fieldsToCheck = ["comment"];
  if(requestData["comment"].length > 250 ) {
    return new NextResponse("Comment is too long", { status: 401 });
  }
  // Loop over each field to check
  for (let field of fieldsToCheck) {
    // Only proceed if the field is defined
    if (requestData[field]) {
      // Use the isToxic function to classify the text
      const isToxicText = await isToxic(requestData[field]);

      // Check classification value
      if (isToxicText) {
        console.log("Toxic");
        return new NextResponse(`Please have a kinder ${field}`, {
          status: 401,
        });
      }
    }
  }

  const user_id = session.user.id;
  // Can only comment once
  const { data: comments, error: fetchError } = await supabase
    .from("comment")
    .select()
    .eq("user_id", user_id)
    .eq("trainer_id", trainer_id);
  if (fetchError) {
    return new NextResponse(JSON.stringify({ error: fetchError.message }), {
      status: 500,
    });
  }
  if (comments.length > 0) {
    return new NextResponse("You can only comment once", { status: 401 });
  }
  // Cannot comment on your own profile
  if (user_id === trainer_id) {
    return new NextResponse("You cannot comment on your own profile", {
      status: 401,
    });
  }
  const comment = requestData.comment;
  console.log("Comment, trainer_id, user_id");
  console.log(comment, trainer_id, user_id);
  const { data, error } = await supabase
    .from("comment")
    .insert([{ user_id: user_id, trainer_id: trainer_id, comment: comment }])
    .select();
  if (error) {
    console.log("error", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
  return new NextResponse(requestData, { status: 200 });
}

export async function GET(request: Request, { params: { trainer_id } }: Props) {
  const supabase = createClient();
  console.log("trainer_id", trainer_id);
  let { data: comments, error } = await supabase.rpc("get_comments_with_user", {
    trainer_id: trainer_id,
  });
  console.log("Comments:");
  console.log(comments);

  if (error) {
    console.log("error");
    return new NextResponse(error.message, { status: 500 });
  }

  return new NextResponse(JSON.stringify(comments), { status: 200 });
}
