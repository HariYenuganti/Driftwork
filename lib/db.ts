import { PrismaClient } from '@prisma/client';

// Make BigInt safely JSON-serializable (the route handlers return this shape).
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

/**
 * Next.js dev server HMR creates multiple module instances; stash the client
 * on the global to avoid Prisma "too many connections" warnings during dev.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
