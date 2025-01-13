import { z } from 'zod';

// Define the schema for the new pizza
const newPizzaSchema = z.object({
  creatorId: z.number(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(255).optional(),
  labelIds: z.array(z.number()).optional(),
  toppingIds: z.array(z.number()).min(1),
  pictureUrl: z.string().url().optional(),
  sizeId: z.number().min(0),
  priceId: z.number().min(0),
});

export const validateNewPizza = (data: unknown) => newPizzaSchema.parse(data);

// export const validateNewPizza = (data: unknown) => {
//   try {
//     return newPizzaSchema.parse(data);
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// };