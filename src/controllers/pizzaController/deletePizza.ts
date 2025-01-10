import { Request, Response } from 'express';

const deletePizza = async (req: Request, res: Response) => {
  try {
    res.send('deletePizza');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default deletePizza;
