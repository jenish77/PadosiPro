import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateToken } from '../../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshTokenSchema,
} from '../../utils/validators';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/verify-otp', validateRequest(verifyOtpSchema), AuthController.verifyOtp);
router.post('/resend-otp', validateRequest(resendOtpSchema), AuthController.resendOtp);
router.post('/refresh-token', validateRequest(refreshTokenSchema), AuthController.refreshToken);
router.get('/me', authenticateToken, AuthController.getMe);

export default router;

