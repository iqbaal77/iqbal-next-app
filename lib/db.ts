// Deprecated shim - use Prisma client (lib/prisma.ts) instead of this legacy db helper.
// Old implementation kept in Git history if you need it.

export default {
  get() {
    throw new Error('lib/db is deprecated. Use lib/prisma (Prisma client) instead.');
  },
  all() {
    throw new Error('lib/db is deprecated. Use lib/prisma (Prisma client) instead.');
  },
  run() {
    throw new Error('lib/db is deprecated. Use lib/prisma (Prisma client) instead.');
  },
  sql: undefined,
}
