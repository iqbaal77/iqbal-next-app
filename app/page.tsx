import Link from 'next/link'
export default function Home(){
  return (
    <div>
      <h1 className="text-2xl font-bold">Iqbal's Shop</h1>
      <p className="mt-4">Improved UI demo. Use the links below to test.</p>
      <div className="mt-4 flex gap-4">
        <Link href="/shop" className="px-3 py-2 bg-blue-600 text-white rounded">Shop</Link>
        <Link href="/dashboard" className="px-3 py-2 bg-gray-800 text-white rounded">Dashboard</Link>
        <Link href="/login" className="px-3 py-2 bg-green-600 text-white rounded">Login</Link>
      </div>
    </div>
  )
}
