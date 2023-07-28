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
    console.log("payload: ", payload)
    // Find where entries match the image_url and user_id then replace it with order
    for (const item of payload) {
        console.log("item: ", item)
        
        const { error } = await supabase
        .from("imageOrder")
        .update({ order: item.order })
        .eq('user_id', session.user.id)
        .eq('image_url', item.image_url);
        if (error) {
            return new NextResponse(error.message, { status: 500 });
        }
    }
    return new NextResponse("Update successful", { status: 200 });
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
    // Get the number of entires for the selected user
    const { data: orderImages, error: error1 } = await supabase
    .from("imageOrder")
    .select("*")
    .eq('user_id', session.user.id);
    if (error1) {
        return new NextResponse(error1.message, { status: 500 });
    }

    let order = 0;
    if(orderImages && orderImages.length > 0) {
        order = orderImages.length + 1
    } else {
        order = 1;
    }
    // If there are no entries, insert the data
    const payload = await request.json();
    console.log("payload: ", payload)
    const insertData ={
        user_id: session.user.id,
        image_url: payload.image_url,
        order: order
    }

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
    const payload = await request.json();
    // Find where the image_url and user_id match and delete it
    const { data: orderImages, error } = await supabase
    .from("imageOrder")
    .delete()
    .eq('user_id', session.user.id)
    .eq('image_url', payload.image_url);
    if(error) {
        return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Delete successful", { status: 200 });
}