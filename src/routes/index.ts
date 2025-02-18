import { Router } from 'express';
import pizzaRouter from './pizzaRoutes';

const router = Router();

router.use('/pizzas', pizzaRouter);

export default router;
