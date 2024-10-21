import { initMongoDB } from './db/initMongoDB.js';
import { initServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  initServer();
};

bootstrap();
