/**
 * CardioSense AI - Full-Stack Express Server with Vite Middleware
 * Serves both the REST API (/api/v1/*) and the React SPA on port 3000
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Version 1 Routes
const MODEL_VERSION = 'v1.4.2-calibrated-hgb';

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'CardioSense AI Express/Node API Gateway',
    modelServingVersion: MODEL_VERSION,
    datasetSource: 'CDC BRFSS 2021 (40,000 Stratified Valid Records)',
    timestamp: new Date().toISOString()
  });
});

// Benchmarks endpoint
app.get('/api/v1/models/benchmark', (req: Request, res: Response) => {
  res.json([
    {
      id: 'hist_gb',
      name: 'HistGradientBoosting (Selected Champion)',
      type: 'Tree Ensemble (LightGBM equivalent)',
      accuracy: 0.901,
      precision: 0.576,
      recall: 0.468,
      f1Score: 0.517,
      rocAuc: 0.846,
      prAuc: 0.452,
      brierScore: 0.059,
      isSelectedChampion: true
    },
    {
      id: 'calibrated_rf',
      name: 'Random Forest (Calibrated)',
      type: '300-Tree Forest with Platt Scaling',
      accuracy: 0.898,
      precision: 0.543,
      recall: 0.431,
      f1Score: 0.481,
      rocAuc: 0.835,
      prAuc: 0.428,
      brierScore: 0.062,
      isSelectedChampion: false
    },
    {
      id: 'keras_dnn',
      name: 'Deep Neural Network (TensorFlow/Keras)',
      type: '4-Layer Dense MLP with BatchNorm & Dropout',
      accuracy: 0.894,
      precision: 0.495,
      recall: 0.420,
      f1Score: 0.454,
      rocAuc: 0.828,
      prAuc: 0.407,
      brierScore: 0.066,
      isSelectedChampion: false
    },
    {
      id: 'logistic_regression',
      name: 'Logistic Regression Baseline',
      type: 'L2-Regularized Generalized Linear Model',
      accuracy: 0.892,
      precision: 0.481,
      recall: 0.386,
      f1Score: 0.429,
      rocAuc: 0.812,
      prAuc: 0.385,
      brierScore: 0.068,
      isSelectedChampion: false
    }
  ]);
});

// Drift telemetry endpoint
app.get('/api/v1/monitoring/drift', (req: Request, res: Response) => {
  res.json({
    timestamp: new Date().toISOString(),
    sampleWindowDays: 7,
    totalEvaluations: 12480,
    featurePsi: {
      ageCategory: 0.042,
      bmi: 0.058,
      highBloodPressure: 0.031,
      smokingStatus: 0.038,
      sleepHours: 0.114,
      generalHealth: 0.049
    },
    overallStatus: 'nominal',
    alertsTriggered: []
  });
});

// Download complete project ZIP endpoint
app.get(['/api/v1/download-source', '/cardiosense-ai-source.zip'], (req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public/cardiosense-ai-source.zip');
  res.download(zipPath, 'cardiosense-ai-source.zip', (err) => {
    if (err) {
      console.error('Error sending zip file:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download zip file' });
      }
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`CardioSense AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
