import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const generateToken = (userId: string, role: string): string => {
  return generateAccessToken(userId, role);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
