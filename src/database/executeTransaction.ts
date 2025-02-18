import { PoolClient } from 'pg';
import { pool } from './pool';
import { AppError, DataBaseError } from '../errors';

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

export async function executeTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
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
    if (err instanceof AppError) throw err; // Si l'erreur est une instance de AppError, on la throw
    throw new DataBaseError({
      // Sinon, on crée une nouvelle instance de DataBaseError
      publicMessage: 'Database error',
      internalMessage: 'Database transaction error',
      details: err,
    });
  } finally {
    client.release();
  }
}

// type 'any' est à éviter, on peut utiliser 'unknown' mais ne fonctionnait pas avec createPizzaDM.ts par exemple qui utilise un type précis
// on peut aussi utiliser un type générique <T> pour la fonction executeTransaction (T est une variable de type)
// Au moment où on va appeler cette fonction, TypeScript va déterminer la nature de T en fonction des arguments et du contexte.

// Exemple :
// function identity<T>(value: T): T {
//  return value;
// }
// => T est inféré automatiquement
//  const num = identity(42); // T est number
//  const str = identity('Hello'); // T est string

// "return result;" : 'result' est ce que le callback a renvoyé.
// La fonction executeTransaction renvoie ce que le callback a renvoyé.
// Puisque le callback renvoie une Promise<T>, le await callback(client) est un T
// Donc, executeTransaction() renvoie un Promise<T> (asynchrone).
