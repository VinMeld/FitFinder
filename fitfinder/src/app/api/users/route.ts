import {NextResponse} from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(request: Request) {
    console.log(request)
    const requestData: User = await request.json()

    console.log(requestData)
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
    const { data, error } = await supabase.auth.signUp({
        email: requestData.email,
        password: requestData.password,
        options: {
            data: {
              first_name: requestData.name,
            }
          }
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