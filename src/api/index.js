import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import db from '../db/index.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const port = 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendUpdate = (type, data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  };

  // Listen for database events
  db.on('memberAdded', (member) => sendUpdate('memberAdded', member));
  db.on('memberRemoved', (member) => sendUpdate('memberRemoved', member));
  db.on('statsUpdated', (stats) => sendUpdate('statsUpdated', stats));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.get('/api/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stats = await db.getStats(today);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const members = await db.getMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trends', async (req, res) => {
  try {
    const trends = await db.getTrends();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

server.listen(port, () => {
  console.log(`API running on port ${port}`);
});