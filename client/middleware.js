import { NextResponse } from 'next/server'
// import { verify } from 'jsonwebtoken'
import { jwtVerify } from 'jose';

const secret = process.env.TOKEN_SECRET;

export default function middleware(req, res, next) {
    const { cookies, url } = req;
    const token = cookies.get('blogToken')?.value
    if (token && url.includes('login')) {

        const verified = jwtVerify(token, secret);
        if (verified) return NextResponse.redirect('http://localhost:3000/dashboard')
        else return NextResponse.next()
    }
    if (url.includes('dashboard')) {
        if (!token) return NextResponse.redirect('http://localhost:3000/login')

        const verified = jwtVerify(token, secret);
        if (verified) return NextResponse.next();
        else return NextResponse.redirect('http://localhost:3000/login');
    }
}


