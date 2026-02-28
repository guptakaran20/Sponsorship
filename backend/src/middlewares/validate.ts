import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, ZodTypeAny } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';

export const validate = (schema: ZodObject<Record<string, ZodTypeAny>>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e) => `${e.path.slice(1).join('.')}: ${e.message}`).join(', ');
        res.status(400).json(ApiResponse.error(messages));
        return;
      }
      next(error);
    }
  };
};
