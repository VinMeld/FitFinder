'use server'
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
export async function PUT(request: Request) {
    const supabase = createClient();

    // Fetch the Current User
    const {
    data: { session },
    } = await supabase.auth.getSession();
    // If there is no user, return 401 Unauthorized
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Assume a JSON was sent in this format
    /* [{
       "image_url": "abc.123",
        "order": 1
    }, {
        "image_url": "abc.1223",
        "order": 2
    } ... ]
    */
    const payload = await request.json();
    // Find where entries match the image_url and user_id then replace it with order
    for (const item of payload) {
        const { error } = await supabase
        .from("imageOrder")
        .update({ order: item.order })
        .eq('user_id', session.user.id)
        .eq('image_url', item.image_url);
        if (error) {
            return new NextResponse(error.message, { status: 500 });
        }
    }
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
    // Find where user_id == session.user.id
    const { data: orderImages, error } = await supabase
    .from("imageOrder")
    .select("*")
    .eq('user_id', session.user.id);
    if (error) {
        return new NextResponse(error.message, { status: 500 });
    }
    return NextResponse.json(orderImages);

}

export async function POST(request: Request) {
    const supabase = createClient();

    // Fetch the Current User
    const {
    data: { session },
    } = await supabase.auth.getSession();
    // If there is no user, return 401 Unauthorized
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    // Assume a JSON was sent in this format
    /* [{
       "image_url": "abc.123",
        "order": 1
    }, {
        "image_url": "abc.1223",
        "order": 2
    } ... ]
    */
    // Find where entries match the image_url and user_id then replace it with order
    // If there is no entry, create a new one
    const payload = await request.json();
    console.log("payload: ", payload)
    const insertData = payload.map(item => ({
        user_id: session.user.id,
        image_url: item.image_url,
        order: item.order
    }));

    const { error } = await supabase
    .from("imageOrder")
    .insert(insertData);
    if (error) {
        return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Insert successful", { status: 200 });

}

export async function DELETE(request: Request) {
    const supabase = createClient();

    // Fetch the Current User
    const {
    data: { session },
    } = await supabase.auth.getSession();
    // If there is no user, return 401 Unauthorized
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    // Assume a JSON was sent in this format
    /* {
         "image_url": "abc.123",
         "order": 1
    }
    */
    // Find where the image_url and user_id match and delete it
    const { data: orderImages, error } = await supabase
    .from("imageOrder")
    .delete()
    .eq('user_id', session.user.id)
    .eq('image_url', request.body.image_url);
    if(error) {
        return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Delete successful", { status: 200 });
}