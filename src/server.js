import app from './app.js';
import { initializeDatabaseSchema } from './config/database.js';

const PORT = 5000;

async function bootServerEngine() {
  // Sync the data structures cleanly prior to loading client interfaces
  await initializeDatabaseSchema();

  app.listen(PORT, () => {
    console.log(`StudyFlow App Core online and listening on network port: ${PORT}`);
  });
}

bootServerEngine();
