import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join('.').replace('body.', ''),
          message: e.message,
        }));
        return sendError(res, formattedErrors[0]?.message || 'Validation error', 400, formattedErrors);
      }
      return sendError(res, 'Invalid request data', 400);
    }
  };
};
