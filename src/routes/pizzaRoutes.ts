import { Router } from 'express';
import {
  createPizza,
  getAllPizzas,
  getPizzaById,
  replacePizza,
  modifyPizza,
  deletePizza,
} from '../controllers/pizzaController';

const router = Router();

router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);
router.post('/', createPizza);
router.put('/:id', replacePizza);
router.patch('/:id', modifyPizza);
router.delete('/:id', deletePizza);

export default router;
