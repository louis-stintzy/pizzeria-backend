import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_: Request, res: Response) => {
  res.send('getAllPizzas');
});
router.get('/:id', (_: Request, res: Response) => {
  res.send('getPizzaById');
});
router.post('/', (_: Request, res: Response) => {
  res.send('createPizza');
});
router.put('/:id', (_: Request, res: Response) => {
  res.send('updatePizzaPUT');
});
router.patch('/:id', (_: Request, res: Response) => {
  res.send('updatePizzaPATCH');
});
router.delete('/:id', (_: Request, res: Response) => {
  res.send('deletePizza');
});

export default router;
