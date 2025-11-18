import prisma from '../../prisma/client';
import crypto from "crypto";

export const createRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt }
  });

  return { token, expiresAt };
};

export const revokeRefreshToken = async (token: string) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true }
  });
};

export const useRefreshTokenAndRotate = async (oldToken: string, userId: string) => {
  const rt = await prisma.refreshToken.findUnique({ where: { token: oldToken } });

  if (!rt || rt.revoked || rt.expiresAt < new Date()) {
    throw new Error('Invalid refresh token');
  }

  await prisma.refreshToken.update({
    where: { id: rt.id },
    data: { revoked: true }
  });

  return createRefreshToken(userId);
};
