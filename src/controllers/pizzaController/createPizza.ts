import { Request, Response } from 'express';
import { validateNewPizza } from '../../utils/validators/newPizzaValidator';
import { createPizzaDM } from '../../dataMappers/pizzaDataMappers/createPizzaDM';

interface CreatePizzaRequestBody {
  creatorId: number;
  name: string;
  description?: string;
  labelIds?: number[];
  toppingIds: number[];
  pictureUrl?: string;
  sizeId: number;
  priceId: number;
}

const createPizza = async (req: Request<{}, {}, CreatePizzaRequestBody>, res: Response) => {
  // voir types de Request : Params, ResBody, ReqBody, Query, etc.
  try {
    // Validate the request body
    const parsedBody = validateNewPizza(req.body);
    // Create the pizza
    console.log('parsedBody');
    console.log(parsedBody);
    const newPizza = await createPizzaDM(parsedBody);

    res.send({ newPizza });
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export default createPizza;
