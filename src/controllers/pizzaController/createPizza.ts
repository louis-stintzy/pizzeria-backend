import { Request, Response } from 'express';
import { validateNewPizza } from '../../utils/validators/newPizzaValidator';
import { createPizzaDM } from '../../dataMappers/pizzaDataMappers/createPizzaDM';
import { CreatePizzaRequestBody } from '../../@types/pizza';

const createPizza = async (req: Request<{}, {}, CreatePizzaRequestBody>, res: Response) => {
  // voir types de Request : Params, ResBody, ReqBody, Query, etc.
  try {
    // Validate the request body
    const parsedBody = validateNewPizza(req.body);
    // Create the pizza
    const newPizza = await createPizzaDM(parsedBody);
    // Send the response
    res.send({ newPizza });
  } catch (error) {
    console.log('error');
    res.status(500).send({ message: (error as Error).message });
  }
};

export default createPizza;
