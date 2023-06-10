import {NextResponse} from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(request: Request) {
  console.log("Get serverside props")
  let { data: countries } = await supabase.from('countries').select()
  return new NextResponse(JSON.stringify( countries), {
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Content-Type': 'application/json',
    }
  })
}

  // return {
  //   props: {
  //    countries: data
  //   },
  // }
  // }
  
