import {NextResponse} from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(request: Request) {
    console.log("TEST")
    let requestData: User;
    try {
        requestData = await request.json();
    } catch (error) {
        console.log('Error parsing JSON:', error);
        return new NextResponse('Bad request', { status: 400 });
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email: requestData.name,
        password: requestData.password,
    })
    if (error) return new NextResponse(JSON.stringify( error), {
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
        }
    })
    return new NextResponse(JSON.stringify( data), {
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
        }
    })
}

export async function POST(request: Request) {
    const requestData: User = await request.json()
    if (!requestData) {
        return new NextResponse('Bad request', { status: 400 });
    }
    const { data, error } = await supabase.auth.signUp({
        email: requestData.email,
        password: requestData.password,
        options: {
            data: {
              first_name: requestData.name,
            }
          }
      })
      if (error) {
        const errorObj = {
            message: error.message,
            // include any other properties you want to send
        };
    
        return new NextResponse(JSON.stringify(errorObj), {
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Content-Type': 'application/json',
            },
        });
    }
    return new NextResponse(JSON.stringify(data), {
        status: 200,
    }, )
}