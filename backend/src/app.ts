import "./instrument.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

import * as Sentry from "@sentry/node";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/sentry-test', (_req, _res) => {
throw new Error('Sentry test error');
});

Sentry.setupExpressErrorHandler(app)
app.use(errorHandler);

export default app;
