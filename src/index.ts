import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  // à configurer + ajouter middleware pour personnalisé ( if (req.headers !== process.env.CORS_ORIGIN) {)...)
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // allow session cookie from browser to pass through
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Pizzeria Backend !');
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
