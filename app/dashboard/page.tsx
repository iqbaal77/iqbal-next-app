import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import prisma from '../../lib/prisma'

export default async function Dashboard(){
  // Server-side auth check
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let user = null
  if (token) {
    try {
      const SECRET = process.env.JWT_SECRET || 'dev'
      const data = jwt.verify(token, SECRET) as any
      user = await prisma.user.findUnique({ where: { id: data.id } })
    } catch {}
  }
  if (!user) redirect('/login')

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold">Welcome{user?`, ${user.name}`:''} — iQ's Shop Admin</h3>
          <p className="mt-2 text-sm text-gray-600">Manage products from the dashboard or browse the public shop.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/products/new"><Button>Add Product</Button></Link>
            <Link href="/shop"><Button className="bg-gray-600">Visit Shop</Button></Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Products</h3>
          <p className="mt-2 text-sm text-gray-600">View, edit, and delete all products.</p>
          <div className="mt-4">
            <Link href="/dashboard/products" className="text-sm text-brand">Manage Products &rarr;</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
