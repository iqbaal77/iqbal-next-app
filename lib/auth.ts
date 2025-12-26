import jwt from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET || 'dev'
export function verifyTokenFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/token=([^;]+);?/) || []
  const token = m[1]
  if (!token) return null
  try {
    const data = jwt.verify(token, SECRET) as any
    return data
  } catch(e){ return null }
}

