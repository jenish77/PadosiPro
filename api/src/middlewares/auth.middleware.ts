import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/crypto';
import { sendError } from '../utils/response';
import { prisma } from '../config/db';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication access token required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isVerified: true, hasCompletedProfile: true },
    });

    if (!user) {
      return sendError(res, 'User no longer exists', 401);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired access token', 401);
  }
};

export const requireVerifiedUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isVerified) {
    return sendError(res, 'Email verification required before accessing this resource', 403);
  }
  next();
};
