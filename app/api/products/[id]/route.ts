import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyTokenFromRequest } from '../../../../lib/auth'

async function resolveParams(ctx: any) {
  let params = ctx?.params;
  if (params && typeof params.then === 'function') {
    try { params = await params; } catch (e) { params = ctx?.params; }
  }
  return params;
}

export async function PATCH(req: Request, ctx: any) {
  const params = await resolveParams(ctx);
  const user = verifyTokenFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const id = Number(params?.id)
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const name = body.name ?? existing.name
  const price = typeof body.price !== 'undefined' ? Number(body.price) : existing.price
  const description = typeof body.description !== 'undefined' ? body.description : existing.description
  const image = typeof body.image !== 'undefined' ? body.image : existing.image
  const updated = await prisma.product.update({ where: { id }, data: { name, price, description, image } })
  return NextResponse.json({ ok: true, product: updated })
}
export async function DELETE(req: Request, ctx: any) {
  const params = await resolveParams(ctx);
  const user = verifyTokenFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params?.id)
  try{
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
