import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyTokenFromRequest } from '../../../lib/auth'
export async function GET(){
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ ok: true, products })
}
export async function POST(req: Request){
  const user = verifyTokenFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json();
  const { name, price, description, image } = body
  if (!name || typeof price === 'undefined') return NextResponse.json({ error: 'Missing fields' }, { status: 422 })
  const created = await prisma.product.create({ data: { name, price: Number(price), description: description || '', image: image || '' } })
  return NextResponse.json({ ok: true, product: created })
}
