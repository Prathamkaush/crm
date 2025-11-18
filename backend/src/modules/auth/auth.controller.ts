import { Request, Response } from 'express';
import * as service from './auth.service';
import * as refreshService from './refresh.service';
import { success, fail } from '../../utils/response';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, company } = req.body;

    const user = await service.createUser(
      name, email, password, phone, address, company
    );

    return success(res, {
      message: "Account created successfully. You can now login.",
      user: { id: user.id, email: user.email, name: user.name }
    }, 201);

  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return fail(res, "Email already exists. Please login instead.", 400);
    }
    return fail(res, err.message || err, 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await service.authenticate(email, password);
    if (!data) return fail(res, 'Invalid credentials', 401);

    const safeUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
      address: data.user.address,
      company: data.user.company,
    };

    return success(res, {
      user: safeUser,
      access: data.access,
      refresh: data.refresh
    });

  } catch (err: any) {
    return fail(res, err.message || err, 400);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return fail(res, 'No token provided', 400);

    const userId = ""; // not required right now
    const rt = await refreshService.useRefreshTokenAndRotate(token, userId);

    return success(res, rt);
  } catch (err: any) {
    return fail(res, err.message || err, 400);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (token) await refreshService.revokeRefreshToken(token);
    return success(res, { message: 'Logged out' });
  } catch (err: any) {
    return fail(res, err.message || err, 500);
  }
};
