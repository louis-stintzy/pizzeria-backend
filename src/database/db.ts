import { Pool, PoolClient } from 'pg';
import { DATABASE_URL } from '../dotenv/config';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database query Error:', err);
    // todo: add logger
    // logger.error(`SQL Error: ${err.message}`, { query: text, params });
    throw new Error('Database query failed');
  }
};

// Cette fonction permet d'exécuter une transaction en utilisant un client de pool
// Elle prend en paramètre une fonction callback qui sera appelée à l'intérieur
// Le callback sera exécuté avec un client que executeTransaction aura créé.
// La fonction callback prend un client en paramètre et retourne une promesse qui est résolue par la fonction executeTransaction

// La fonction executeTransaction commence par appeler la méthode connect() de pool pour obtenir un client
// Ensuite, elle commence une transaction en exécutant la requête BEGIN
// Elle appelle ensuite la fonction callback avec le client comme paramètre

// si la fonction callback se termine sans erreur, la transaction est validée en exécutant la requête COMMIT
// si la fonction callback se termine avec une erreur, la transaction est annulée en exécutant la requête ROLLBACK
// enfin, le client est relâché avec la méthode release()

export const executeTransaction = async (callback: (client: PoolClient) => Promise<any>) => {
  // pool.connect() crée une connexion dédiée et retourne un objet PoolClient pour exécuter des requêtes.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Une fois le client obtenu, il est passé au callback
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database transaction Error:', err);
    throw new Error('Database transaction failed');
  } finally {
    client.release();
  }
};
