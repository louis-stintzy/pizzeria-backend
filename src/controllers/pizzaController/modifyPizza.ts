import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/require-await
const modifyPizza = async (req: Request, res: Response) => {
  try {
    res.send('modifyPizza');
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default modifyPizza;
