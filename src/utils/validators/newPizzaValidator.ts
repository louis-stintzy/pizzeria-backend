import { z } from 'zod';
import { ValidationError } from '../../errors';

// Define the schema for the new pizza
const newPizzaSchema = z.object({
  creatorId: z.number().min(0),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(255).optional(),
  labelIds: z.array(z.number().min(0)).optional(),
  toppingIds: z.array(z.number().min(0)).min(1),
  pictureUrl: z.string().url().optional(),
  sizeId: z.number().min(0),
  priceId: z.number().min(0),
});

// Validate the new pizza data
export const validateNewPizza = (data: unknown) => {
  try {
    return newPizzaSchema.parse(data);
  } catch (err) {
    throw new ValidationError('Invalid new pizza data', err);
  }
};
