import { RequestHandler } from 'express';
import { validateNewPizza } from '../../utils/validators/newPizzaValidator';
import { createPizzaDM } from '../../dataMappers/pizzaDataMappers/createPizzaDM';
import { CreatePizzaRequestBody, CreatePizzaResponseBody } from '../../@types/pizza';

// RequestHandler<
//   P = ParamsDictionary,  // Paramètres d'URL (req.params)
//   ResBody = any,         // Type de la réponse qu'on renvoie (res.body)
//   ReqBody = any,         // Type du body de la requête (req.body)
//   ReqQuery = ParsedQs    // Type de la query string (req.query)
// >

const createPizza: RequestHandler<unknown, CreatePizzaResponseBody, CreatePizzaRequestBody> = async (
  req,
  res,
  next
) => {
  try {
    // Validate the request body
    const parsedBody = validateNewPizza(req.body);
    // Create the pizza
    const newPizza = await createPizzaDM(parsedBody);
    // Send the response
    res.status(201).json({ newPizza });
    return;
  } catch (error) {
    next(error);
  }
};

export default createPizza;
