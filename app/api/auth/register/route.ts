import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'
const SECRET = process.env.JWT_SECRET || 'dev'
export async function POST(req: Request){
  try{
    const body = await req.json()
    const { name, email, password } = body
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 422 })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already used' }, { status: 409 })
    const hashed = await hash(password, 10)
    const created = await prisma.user.create({ data: { name, email, password: hashed } })
    const user = { id: created.id, name: created.name, email: created.email }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })
    const res = NextResponse.json({ ok: true, user })
    // explicit cookie options
    const cookieOpts: any = { httpOnly: true, maxAge: 60*60*24*7, path: '/', sameSite: 'lax' }
    if (process.env.NODE_ENV === 'production') cookieOpts.secure = true
    res.cookies.set('token', token, cookieOpts)
    return res
  }catch(err:any){
    console.error('REGISTER ERROR', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
