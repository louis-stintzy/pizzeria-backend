import { Request, Response } from 'express';

const modifyPizza = async (req: Request, res: Response) => {
  try {
    res.send('modifyPizza');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default modifyPizza;
