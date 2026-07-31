const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const showData = require('./data/show-data');
const UnlockAttempt = require('./models/UnlockAttempt');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const expectedPassword = (process.env.SHOW_PASSWORD || 'loveflix').trim().toLowerCase();
const mongoUri = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const publicDistPath = path.join(__dirname, '..', 'dist', 'dishsum');

app.get('/api/health', async (_req, res) => {
  res.json({
    ok: true,
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString()
  });
});

app.get('/api/show', (_req, res) => {
  res.json(showData);
});

app.get('/api/profiles', (_req, res) => {
  res.json(showData.profiles);
});

app.post('/api/unlock', async (req, res) => {
  const password = String(req.body?.password || '').trim().toLowerCase();
  const success = password === expectedPassword;
  const message = success ? 'Access granted.' : 'Wrong password. Try the one from your private story.';

  if (mongoose.connection.readyState === 1) {
    try {
      await UnlockAttempt.create({
        password: password || '[empty]',
        success,
        userAgent: req.get('user-agent') || ''
      });
    } catch (error) {
      console.error('Failed to save unlock attempt:', error.message);
    }
  }

  res.status(success ? 200 : 401).json({ success, message });
});

if (fs.existsSync(publicDistPath)) {
  app.use(express.static(publicDistPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDistPath, 'index.html'));
  });
}

async function start() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected.');
    } catch (error) {
      console.warn('MongoDB connection failed, continuing without persistence.');
      console.warn(error.message);
    }
  }

  app.listen(port, () => {
    console.log(`Loveflix API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
