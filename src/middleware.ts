// import {NextRequest, NextResponse} from 'next/server'

// export function middleware(req: NextRequest) {
//     console.log("request: ", req.nextUrl.pathname)
//     const allCookies = req.cookies.getAll()
//     console.log("cookies: ", allCookies)
//     return NextResponse.next()
// }

// export const config = {
//     matcher: '/'
// }

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });


  return res;
}

