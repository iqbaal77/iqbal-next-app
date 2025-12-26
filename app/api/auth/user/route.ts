import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'
const SECRET = process.env.JWT_SECRET || 'dev'
export async function GET(req: Request){
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/token=([^;]+);?/) || []
  const token = m[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try{
    const data = jwt.verify(token, SECRET) as any
    const u = await prisma.user.findUnique({ where: { id: data.id } })
    if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ ok: true, user: { id: u.id, name: u.name, email: u.email } })
  }catch(e){ return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}
