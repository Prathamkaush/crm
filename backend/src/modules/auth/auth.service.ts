import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { createRefreshToken } from './refresh.service';

export const createUser = async (name: string, email: string, password: string, phone?: string, address?: string, company?: string) => {
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone, address, company }
  });

  return user;
};

export const authenticate = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  const access = signAccessToken({ id: user.id, role: user.role });
  const refreshObj = await createRefreshToken(user.id);
  const refresh = signRefreshToken({ token: refreshObj.token });

  return { user, access, refresh: refreshObj.token };
};
