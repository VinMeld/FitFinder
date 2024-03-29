import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { log } from 'next-axiom'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    log.info("code", code.toString);
    const {error} = await supabase.auth.exchangeCodeForSession(code);
    if(error) log.error(error.message);
  }
  console.log("redirecting to", next);
  return NextResponse.redirect(new URL(next, req.url));
}