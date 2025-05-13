import { PrismaClient } from './generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    __internal: {
      engine: {
        maxPreparedStatements: 0, // 💥 disables prepared statements
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
