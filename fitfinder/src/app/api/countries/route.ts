import {NextResponse} from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(request: Request) {
  let { data: countries } = await supabase.from('countries').select()
  return new NextResponse(JSON.stringify( countries), {
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Content-Type': 'application/json',
    }
  })
}