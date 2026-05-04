import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
