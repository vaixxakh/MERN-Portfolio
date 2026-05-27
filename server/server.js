import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import { loggerMiddleware, getLogs, clearLogs, addLog } from './logs.js';
import { sendContactEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Intercept requests and feed into simulator logs
app.use(loggerMiddleware);

// Initialize DB Manager
db.initialize().then(() => {
  addLog({
    method: "DB",
    path: "/db/init",
    status: 200,
    latency: 0,
    size: "0 B",
    message: `Database layer initialized. Mode: ${db.dbMode.toUpperCase()} (${db.getStats().engine}).`
  });
});

// 1. GET /api/status - Returns system & database status
app.get('/api/status', (req, res) => {
  const stats = db.getStats();
  
  res.json({
    status: 'online',
    uptime: Math.round(process.uptime()),
    memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    database: stats,
    timestamp: new Date().toISOString()
  });
});

// 2. GET /api/messages - Returns all contact messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.getMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages from database', details: err.message });
  }
});

// 3. POST /api/messages - Saves a new contact message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const saved = await db.addMessage({ name, email, subject: subject || 'General Inquiry', message });
    
    // Trigger async SMTP notification in the background (non-blocking)
    sendContactEmail(saved).catch(err => {
      console.error(`[BACKGROUND EMAIL EXCEPTION] ${err.message}`);
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Database transaction error', details: err.message });
  }
});

// 4. DELETE /api/messages/:id - Removes a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteMessage(id);
    if (deleted) {
      res.json({ success: true, message: `Message ${id} deleted successfully.` });
    } else {
      res.status(404).json({ error: `Message with ID ${id} not found.` });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database transaction error', details: err.message });
  }
});

// 5. GET /api/logs - Returns server logs for client MERN terminal
app.get('/api/logs', (req, res) => {
  res.json(getLogs());
});

// 6. POST /api/test-controller - Simulates API latency / heavy processing
app.post('/api/test-controller', async (req, res) => {
  const { delay } = req.body;
  const waitMs = Math.min(Math.max(parseInt(delay) || 1500, 100), 5000); // between 100ms and 5s
  
  await new Promise(resolve => setTimeout(resolve, waitMs));
  
  res.json({
    success: true,
    simulatedDelay: waitMs,
    message: `Heavy database controller operation completed successfully after ${waitMs}ms.`
  });
});

// 7. GET /api/error-test - Explicitly throws error to test client-side catch & error animations
app.get('/api/error-test', (req, res) => {
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'ERR_SIMULATED_DB_CRASH',
    message: 'Simulated exception: The database cluster failed to respond to the connection pool heartbeat within the allocated threshold.'
  });
});

// 8. POST /api/reset - Resets logs & databases to default starter items
app.post('/api/reset', async (req, res) => {
  try {
    await db.resetDatabase();
    clearLogs();
    addLog({
      method: "DB",
      path: "/db/reset",
      status: 200,
      latency: 0,
      size: "0 B",
      message: "Database and logs successfully reset to default developer entries."
    });
    res.json({ success: true, message: 'Database reset completed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset database', details: err.message });
  }
});

// Standard 404 Route
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start listening on port
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  MERN STACK PORTFOLIO BACKEND EXPRESS SERVER       `);
  console.log(`  Running on: http://localhost:${PORT}              `);
  console.log(`  Database fallback configured. Loaded immediately. `);
  console.log(`====================================================`);
});
