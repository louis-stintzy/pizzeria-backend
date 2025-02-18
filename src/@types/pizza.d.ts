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

export interface CreatePizzaDMResponse {
  id: number;
}
export interface CreatePizzaResponseBody {
  newPizza: {
    id: number;
    // name: string;
    // description: string;
    // price: number;
  };
}
