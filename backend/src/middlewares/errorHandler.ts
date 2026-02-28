import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message));
    return;
  }

  logger.error(err);

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json(ApiResponse.error(isDev ? err.message : 'Internal server error'));
};
