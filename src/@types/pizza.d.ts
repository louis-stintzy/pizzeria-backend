export interface CreatePizzaRequestBody {
  creatorId: number;
  name: string;
  description?: string;
  labelIds?: number[];
  toppingIds: number[];
  pictureUrl?: string;
  sizeId: number;
  priceId: number;
}
