import dotenv from 'dotenv';
dotenv.config();

import { pool } from './db';

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testConnection();
