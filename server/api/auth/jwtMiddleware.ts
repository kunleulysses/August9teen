import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || './jwt-public.pem');

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err: any, payload: any) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = payload;
    next();
  });
}