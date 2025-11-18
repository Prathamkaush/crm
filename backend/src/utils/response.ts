import { Response } from 'express';


export const success = (res: Response, data: any, status = 200) =>
res.status(status).json({ success: true, data });


export const fail = (res: Response, error: any, status = 400) =>
res.status(status).json({ success: false, error });