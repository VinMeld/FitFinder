// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// import type { NextRequest } from 'next/server'
// //import type { Database } from '@/lib/database.types'

// export async function GET(request: NextRequest) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')

//   if (code) {
//     const supabase = createRouteHandlerClient({ cookies })
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(new URL(next, req.url));
// }

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  console.log("redirecting to", next);
  return NextResponse.redirect(new URL(next, req.url));
}