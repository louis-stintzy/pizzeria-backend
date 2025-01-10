import { Router } from 'express';
import pizzaRouter from './pizzaRoutes';

const router = Router();

router.use('/pizza', pizzaRouter);

export default router;
