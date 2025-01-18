import { RequestHandler } from 'express';
import { validateNewPizza } from '../../utils/validators/newPizzaValidator';
import { createPizzaDM } from '../../dataMappers/pizzaDataMappers/createPizzaDM';
import { CreatePizzaRequestBody } from '../../@types/pizza';

// RequestHandler<
//   P = ParamsDictionary,  // Paramètres d'URL (req.params)
//   ResBody = any,         // Type de la réponse qu'on renvoie (res.body)
//   ReqBody = any,         // Type du body de la requête (req.body)
//   ReqQuery = ParsedQs    // Type de la query string (req.query)
// >

// todo : à modifier avec la gestion des erreurs, createPizzaResponse sera dans pizza.d.ts
interface createPizzaResponse {
  newPizza:
    | {
        id: number;
        // name: string;
        // description: string;
        // price: number;
      }
    | { message: string };
}

const createPizza: RequestHandler<unknown, createPizzaResponse, CreatePizzaRequestBody> = async (req, res) => {
  try {
    // Validate the request body
    const parsedBody = validateNewPizza(req.body);
    // Create the pizza
    const newPizza = await createPizzaDM(parsedBody);
    // Send the response
    res.status(201).json({ newPizza });
    return;
  } catch (error) {
    // todo : à modifier avec la gestion des erreurs
    console.log('error');
    res.status(500).send({ newPizza: { message: (error as Error).message } });
    return;
  }
};

export default createPizza;
