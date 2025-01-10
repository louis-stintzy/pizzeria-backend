import { Request, Response } from 'express';

const createPizza = async (req: Request, res: Response) => {
  try {
    res.send('createPizza');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default createPizza;
