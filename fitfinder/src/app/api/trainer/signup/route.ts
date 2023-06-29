import { NextResponse } from "next/server";
import { createClient } from "../../../../app/utils/supabase-browser";
const supabase = createClient();

export async function POST(request: Request) {
    let requestData = await request.json()
    if (!requestData) {
        return new NextResponse('Bad request', { status: 400 })
    }
    
    //requestData = JSON.parse(requestData);
    console.log(requestData);
    console.log(requestData["data"]["user"]["id"]);
    const data = await supabase
    .from('Trainer')
    .insert([
        { 
        id:requestData["data"]["user"]["id"]
        //   firstName: requestData.firstName,
        //   lastName: requestData.lastName,
          // include other trainer fields as needed
        },
    ]);

    const data1 = await supabase
    .from('Trainer')
    .select('*')

    console.log(data1);

    console.log(data);
    //console.log(trainerError);

    return new NextResponse(JSON.stringify(requestData), {
        status: 200,
    }, )
}