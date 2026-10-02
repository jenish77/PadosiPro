import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import profileRoutes from '../modules/profile/profile.routes';
import taskRoutes from '../modules/tasks/task.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/tasks', taskRoutes);

export default router;
