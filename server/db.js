import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR = path.join(__dirname, 'data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'messages.json');

// Standard message schema fields: id, name, email, subject, message, createdAt
const DEFAULT_MESSAGES = [
  {
    id: "msg_default_1",
    name: "Abhinav K.",
    email: "abhinav@bridgeon.in",
    subject: "Bridgeon MERN Review",
    message: "Vaishakh's performance in our intensive MERN stack curriculum was excellent. His capstone work showcased high understanding of routing, schema design, and asynchronous server states.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "msg_default_2",
    name: "Sophia George",
    email: "sophia.g@lumiere.com",
    subject: "Lumiere E-Commerce Website",
    message: "During his internship, Vaishakh built our full-stack Lumiere Luxury Lighting website. The interactive catalog and fluid dark mode animations are highly professional.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "msg_default_3",
    name: "Rajesh Varma",
    email: "rajesh.varma@localgig.net",
    subject: "Local Freelancer Platform",
    message: "Excellent job building our Local Service Freelancer Platform! The localized search endpoints and service booking pipelines are robust, quick, and clean.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];

class DatabaseManager {
  constructor() {
    this.dbMode = 'json'; // Default to 'json' until MongoDB connects
    this.connected = false;
    this.MessageModel = null;
  }

  async initialize() {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log(`[DB] Found MONGODB_URI. Attempting MongoDB connection...`);
      try {
        // Use mongoose to connect with a 3000ms timeout
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        });

        // Setup Schema and Model
        const messageSchema = new mongoose.Schema({
          name: { type: String, required: true },
          email: { type: String, required: true },
          subject: { type: String, required: true },
          message: { type: String, required: true },
          createdAt: { type: Date, default: Date.now }
        });

        // Ensure we can export a virtual id
        messageSchema.virtual('id').get(function() {
          return this._id.toHexString();
        });
        messageSchema.set('toJSON', { virtuals: true });

        this.MessageModel = mongoose.model('Message', messageSchema);
        this.dbMode = 'mongodb';
        this.connected = true;
        console.log(`[DB] Connected to MongoDB Cloud successfully!`);
        return;
      } catch (err) {
        console.warn(`[DB WARNING] MongoDB connection failed: ${err.message}`);
        console.warn(`[DB] Gracefully falling back to Local JSON File database...`);
      }
    } else {
      console.log(`[DB] No MONGODB_URI detected. Initiating Local JSON File database fallback.`);
    }

    // JSON Fallback initialization
    this.dbMode = 'json';
    this.connected = false;
    
    // Ensure the folder exists
    if (!fs.existsSync(JSON_DB_DIR)) {
      fs.mkdirSync(JSON_DB_DIR, { recursive: true });
    }

    // Ensure the file exists, if not write defaults
    if (!fs.existsSync(JSON_DB_PATH)) {
      this.writeJsonFile(DEFAULT_MESSAGES);
      console.log(`[DB] Created default data store at ${JSON_DB_PATH}`);
    } else {
      try {
        // Read file to verify integrity, if corrupt reset with defaults
        const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
        JSON.parse(data);
        console.log(`[DB] Loaded existing data store at ${JSON_DB_PATH}`);
      } catch (err) {
        console.error(`[DB] Data store file corrupt, resetting with defaults.`);
        this.writeJsonFile(DEFAULT_MESSAGES);
      }
    }
  }

  // Helper JSON operations
  readJsonFile() {
    try {
      const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[DB] Failed reading local database file, returning empty array', err);
      return [];
    }
  }

  writeJsonFile(data) {
    try {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed writing to local database file', err);
    }
  }

  // Unified Database Operations
  async getMessages() {
    if (this.dbMode === 'mongodb' && this.connected) {
      const msgs = await this.MessageModel.find().sort({ createdAt: -1 });
      return msgs.map(m => m.toJSON());
    } else {
      // In JSON mode, sort by createdAt descending
      const msgs = this.readJsonFile();
      return msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  async addMessage(msgData) {
    const newMessage = {
      name: msgData.name || 'Anonymous',
      email: msgData.email || 'no-email@test.com',
      subject: msgData.subject || 'No Subject',
      message: msgData.message || '',
    };

    if (this.dbMode === 'mongodb' && this.connected) {
      const msg = new this.MessageModel(newMessage);
      const saved = await msg.save();
      return saved.toJSON();
    } else {
      const msgs = this.readJsonFile();
      const createdMsg = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        ...newMessage,
        createdAt: new Date().toISOString()
      };
      msgs.push(createdMsg);
      this.writeJsonFile(msgs);
      return createdMsg;
    }
  }

  async deleteMessage(id) {
    if (this.dbMode === 'mongodb' && this.connected) {
      const result = await this.MessageModel.findByIdAndDelete(id);
      return !!result;
    } else {
      const msgs = this.readJsonFile();
      const filtered = msgs.filter(m => m.id !== id);
      if (filtered.length !== msgs.length) {
        this.writeJsonFile(filtered);
        return true;
      }
      return false;
    }
  }

  async resetDatabase() {
    if (this.dbMode === 'mongodb' && this.connected) {
      await this.MessageModel.deleteMany({});
      // Insert default items for MongoDB as well to make it look active
      for (const item of DEFAULT_MESSAGES) {
        // strip original id so mongodb assigns a fresh ObjectId
        const { id, ...rest } = item;
        const fresh = new this.MessageModel(rest);
        await fresh.save();
      }
      return true;
    } else {
      this.writeJsonFile(DEFAULT_MESSAGES);
      return true;
    }
  }

  getStats() {
    const isMongo = this.dbMode === 'mongodb';
    let sizeBytes = 0;
    
    if (!isMongo) {
      try {
        if (fs.existsSync(JSON_DB_PATH)) {
          sizeBytes = fs.statSync(JSON_DB_PATH).size;
        }
      } catch (err) {
        // ignore
      }
    }

    return {
      dbMode: this.dbMode,
      connected: this.connected,
      engine: isMongo ? 'MongoDB Cloud Atlas' : 'Local JSON File System',
      connectionString: isMongo ? 'mongodb+srv://******@cluster.mongodb.net' : 'file:///server/data/messages.json',
      storageFile: !isMongo ? 'server/data/messages.json' : 'Collection: messages',
      fileSize: !isMongo ? `${(sizeBytes / 1024).toFixed(2)} KB` : 'N/A (Cloud Managed)',
    };
  }
}

const db = new DatabaseManager();
export default db;
