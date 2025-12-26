import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'
const SECRET = process.env.JWT_SECRET || 'dev'
export async function POST(req: Request){
  try{
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })
    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
    const cookieOpts: any = { httpOnly: true, maxAge: 60*60*24*7, path: '/', sameSite: 'lax' }
    if (process.env.NODE_ENV === 'production') cookieOpts.secure = true
    res.cookies.set('token', token, cookieOpts)
    return res
  }catch(err:any){
    console.error('LOGIN ERROR', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
