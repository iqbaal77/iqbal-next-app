import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var -- for dev hot-reload
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (!global.prisma) global.prisma = new PrismaClient()
  return global.prisma
}

// Lazy proxy: don't create the client until a property is accessed.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = createPrismaClient()
    // @ts-ignore - forward property access to the real client
    const value = (client as any)[prop]
    if (typeof value === 'function') return value.bind(client)
    return value
  },
  // allow calling prisma(...) if someone treats it as a function
  apply(_, __, args: any[]) {
    const client = createPrismaClient()
    // @ts-ignore
    return (client as any).apply(undefined, args)
  }
})

export default prisma

