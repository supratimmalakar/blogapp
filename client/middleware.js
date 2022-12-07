import { NextResponse } from 'next/server'

export default function middleware(req, res, next) {
    const { cookies, url } = req;
    const token = cookies.get('blogToken')?.value
    if (token && url.includes('login')) {
        if (token) return NextResponse.redirect('http://localhost:3000/dashboard')
        else return NextResponse.next()
    }
    if (url.includes('dashboard')) {
        if (!token) return NextResponse.redirect('http://localhost:3000/login')
        else return NextResponse.next();
    }
}


