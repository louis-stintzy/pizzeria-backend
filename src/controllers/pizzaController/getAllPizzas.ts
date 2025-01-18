import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/require-await
const getAllPizzas = async (req: Request, res: Response) => {
  try {
    res.send('getAllPizzas');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default getAllPizzas;
