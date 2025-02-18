import { PORT } from './dotenv/config';

import app from './app';

// Lance le serveur
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
