import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
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

// Analyser les requêtes entrantes avec des données JSON (remplace body-parser)
app.use(express.json());

// Permettre l'utilisation de la methode POST
app.use(express.urlencoded({ extended: true }));

// Route '/', route de bienvenue
app.get('/', (_: Request, res: Response) => {
  res.send('Welcome to the Pizzeria Backend !');
});

// Routes '/api', router
app.use('/api', router);

// Routes non définie
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Lance le serveur
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
