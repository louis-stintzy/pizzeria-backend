import { CreatePizzaRequestBody } from '../../@types/pizza';
import { executeTransaction } from '../../database/executeTransaction';

interface CreatePizzaDMResponse {
  id: number;
}

export const createPizzaDM = async (parsedBody: CreatePizzaRequestBody): Promise<CreatePizzaDMResponse> => {
  const { creatorId, name, description, labelIds, toppingIds, pictureUrl, sizeId, priceId } = parsedBody;

  return executeTransaction(async (client) => {
    // Check the existence of the creator and its role
    const creatorQuery = `
      SELECT app_user.id AS user_id, app_user.role_id AS user_role_id, role.type AS role_type
      FROM app_user
      LEFT JOIN role ON app_user.role_id = role.id
      WHERE app_user.id = $1`;
    const creatorValues = [creatorId];
    const creatorResult = await client.query(creatorQuery, creatorValues);
    if (creatorResult.rowCount === 0) throw new Error('Creator not found');
    if (creatorResult.rows[0].role_type !== 'manager') throw new Error('Creator is not a manager');

    // Check labels, toppings, size & price
    // todo: mettre en cache toppings, labels, size, price et checker le cache plutôt que la db
    if (labelIds) {
      const labelQuery = 'SELECT id FROM label WHERE id = ANY($1::int[])';
      const labelValues = [labelIds];
      const labelResult = await client.query(labelQuery, labelValues);
      if (labelResult.rowCount !== labelIds.length) throw new Error('Some labels not found');
    }

    const toppingQuery = 'SELECT id FROM topping WHERE id = ANY($1::int[])';
    const toppingValues = [toppingIds];
    const toppingResult = await client.query(toppingQuery, toppingValues);
    if (toppingResult.rowCount !== toppingIds.length) throw new Error('Some toppings not found');

    const sizeQuery = 'SELECT id FROM size WHERE id = $1';
    const sizeValues = [sizeId];
    const sizeResult = await client.query(sizeQuery, sizeValues);
    if (sizeResult.rowCount === 0) throw new Error('Size not found');

    const priceQuery = 'SELECT id FROM price WHERE id = $1';
    const priceValues = [priceId];
    const priceResult = await client.query(priceQuery, priceValues);
    if (priceResult.rowCount === 0) throw new Error('Price not found');

    // Insert image in the database
    // todo: on gère le cas pour une seule image -> gérer le cas pour plusieurs images
    let newPictureId;
    if (pictureUrl) {
      const insertPictureQuery = 'INSERT INTO picture VALUES ($1) RETURNING id';
      const insertPictureValues = [pictureUrl];
      const insertPictureResult = await client.query(insertPictureQuery, insertPictureValues);
      newPictureId = insertPictureResult.rows[0].id;
    }

    // Insert pizza
    const insertPizzaQuery = 'INSERT INTO pizza (name, description, creator_id) VALUES ($1, $2, $3) RETURNING id';
    const insertPizzaValues = [name, description, creatorId];
    const insertPizzaResult = await client.query(insertPizzaQuery, insertPizzaValues);
    const newPizzaId = insertPizzaResult.rows[0].id;

    // Insert pizza relationships
    if (labelIds) {
      await Promise.all(
        labelIds.map(async (labelId) => {
          const insertPizzaLabelQuery = 'INSERT INTO pizza_has_label (pizza_id, label_id) VALUES ($1, $2)';
          const insertPizzaLabelValues = [newPizzaId, labelId];
          await client.query(insertPizzaLabelQuery, insertPizzaLabelValues);
        })
      );
    }

    await Promise.all(
      toppingIds.map(async (toppingId) => {
        const insertPizzaToppingQuery = 'INSERT INTO pizza_has_topping (pizza_id, topping_id) VALUES ($1, $2)';
        const insertPizzaToppingValues = [newPizzaId, toppingId];
        await client.query(insertPizzaToppingQuery, insertPizzaToppingValues);
      })
    );

    if (pictureUrl || newPictureId) {
      const insertPizzaPictureQuery = 'INSERT INTO pizza_has_picture (pizza_id, picture_id) VALUES ($1, $2)';
      const insertPizzaPictureValues = [newPizzaId, newPictureId];
      await client.query(insertPizzaPictureQuery, insertPizzaPictureValues);
    }

    const insertPizzaSizePriceQuery =
      'INSERT INTO pizza_size_price (pizza_id, size_id, price_id, creator_id) VALUES ($1, $2, $3, $4)';
    const insertPizzaSizePriceValues = [newPizzaId, sizeId, priceId, creatorId];
    await client.query(insertPizzaSizePriceQuery, insertPizzaSizePriceValues);

    return { id: newPizzaId }; // Si on veut renvoyer plus d'infos sur la pizza, il faut faire une requête SELECT
  });
};
