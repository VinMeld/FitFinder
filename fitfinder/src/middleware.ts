import {NextRequest, NextResponse} from 'next/server'

export function middleware(req: NextRequest) {
    console.log("request: ", req.nextUrl.pathname)
    const allCookies = req.cookies.getAll()
    console.log("cookies: ", allCookies)
    return NextResponse.next()
}

export const config = {
    matcher: '/'
}