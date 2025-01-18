import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/require-await
const getPizzaById = async (req: Request, res: Response) => {
  try {
    res.send('getPizzaById');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default getPizzaById;
