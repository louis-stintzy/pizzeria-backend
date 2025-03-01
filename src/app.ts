import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors';
import { morganMiddleware } from './middlewares/morganMiddleware';

const app = express();

app.use(
  // todo : à configurer + ajouter middleware pour personnalisé ( if (req.headers !== process.env.CORS_ORIGIN) {)...)
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // allow session cookie from browser to pass through
  })
);

// Analyser les requêtes entrantes avec des données JSON (remplace body-parser)
app.use(express.json());

// Permettre l'utilisation de la methode POST
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use(morganMiddleware);

// Route '/', route de bienvenue
app.get('/', (_: Request, res: Response) => {
  res.send('Welcome to the Pizzeria Backend !');
});

// Routes '/api', router
app.use('/api', router);

// Routes non définie
app.use((req: Request, _res: Response) => {
  throw new NotFoundError({ publicMessage: 'Route not found', internalMessage: `Route ${req.originalUrl} not found` });
});

// Middleware pour gérer les erreurs
app.use(errorHandler);

export default app;
