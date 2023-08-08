import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers"
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    //return NextResponse.redirect("https://www.fitfinder.ca")
    try{
    const requestURL = new URL(request.url);
    const code = requestURL.searchParams.get('code');
    if(code){
        const supabase = createRouteHandlerClient({ cookies});
        await supabase.auth.exchangeCodeForSession(code);   
    }
        return NextResponse.redirect("https://www.fitfinder.ca")
    } catch(error){
        return NextResponse.redirect("https://www.fitfinder.ca")
    }
    

    return NextResponse.redirect("https://www.fitfinder.ca")
}
