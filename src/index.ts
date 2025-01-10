import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Pizzeria Backend !');
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
