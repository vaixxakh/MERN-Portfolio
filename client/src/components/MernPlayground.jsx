import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaServer, FaDatabase, FaTrash, FaSync, FaCheckCircle, 
  FaExclamationTriangle, FaCode, FaPaperPlane, FaSpinner, 
  FaTerminal, FaFolderOpen, FaArrowRight, FaClock, FaWifi
} from 'react-icons/fa';
import { SiReact, SiMongodb, SiNodedotjs, SiExpress } from 'react-icons/si';

const CODE_TEMPLATES = {
  get_messages: {
    frontend: `// React Component: Trigger API Fetch
const fetchMessages = async () => {
  setIsLoading(true);
  try {
    const res = await axios.get('/api/messages');
    setMessages(res.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};`,
    backend: `// Express Server: GET Controller
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.getMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'DB Read Failed' });
  }
});`
  },
  post_message: {
    frontend: `// React Component: Submit Form
const sendMessage = async (formData) => {
  setIsLoading(true);
  try {
    const res = await axios.post('/api/messages', formData);
    setMessages([res.data, ...messages]);
    setForm({ name: '', email: '', subject: '', message: '' });
  } catch (err) {
    setError(err.response.data.error);
  } finally {
    setIsLoading(false);
  }
};`,
    backend: `// Express Server: POST Controller
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Fields required' });
    }
    const saved = await db.addMessage({ name, email, subject, message });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'DB Write Failed' });
  }
});`
  },
  delete_message: {
    frontend: `// React Component: Trigger Item Delete
const deleteMessage = async (id) => {
  setIsLoading(true);
  try {
    await axios.delete(\`/api/messages/\${id}\`);
    setMessages(messages.filter(m => m.id !== id));
  } catch (err) {
    setError('Delete failed');
  } finally {
    setIsLoading(false);
  }
};`,
    backend: `// Express Server: DELETE Controller
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.deleteMessage(id);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'DB Delete Failed' });
  }
});`
  },
  slow_task: {
    frontend: `// React Component: Simulated Latency Task
const triggerHeavyProcess = async () => {
  setIsLoading(true);
  try {
    const res = await axios.post('/api/test-controller', { delay: 2000 });
    setResult(res.data);
  } catch (err) {
    setError('Process halted');
  } finally {
    setIsLoading(false);
  }
};`,
    backend: `// Express Server: Heavy Task (With Promise Delay)
app.post('/api/test-controller', async (req, res) => {
  const { delay } = req.body;
  const waitMs = Math.min(Math.max(parseInt(delay) || 2000, 100), 5000);
  
  // Custom delay multiplier
  await new Promise(resolve => setTimeout(resolve, waitMs));
  
  res.json({
    success: true,
    message: \`Operation finished after \${waitMs}ms\`
  });
});`
  },
  error_task: {
    frontend: `// React Component: Trigger Failing API
const triggerDatabaseCrash = async () => {
  setIsLoading(true);
  try {
    await axios.get('/api/error-test');
  } catch (err) {
    setError(err.response.data.message); // Captured 500!
  } finally {
    setIsLoading(false);
  }
};`,
    backend: `// Express Server: Error Dispatcher Route
app.get('/api/error-test', (req, res) => {
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'ERR_SIMULATED_DB_CRASH',
    message: 'Simulated exception: Connection pool timeout.'
  });
});`
  },
  get_status: {
    frontend: `// React Component: Fetch Server Diagnostics
const checkServerHealth = async () => {
  try {
    const res = await axios.get('/api/status');
    setSystemStats(res.data);
  } catch (err) {
    setSystemStats(null);
  }
};`,
    backend: `// Express Server: System Status & Database Wrapper
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    uptime: Math.round(process.uptime()),
    memoryUsage: process.memoryUsage().heapUsed,
    database: db.getStats()
  });
});`
  }
};

export default function MernPlayground() {
  // State variables
  const [activeAction, setActiveAction] = useState('get_messages');
  const [flowStage, setFlowStage] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(0);
  const [errorText, setErrorText] = useState('');
  
  // Form input for message creations
  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    subject: 'Feedback',
    message: ''
  });

  // Highlight tab for inspection
  const [inspectTab, setInspectTab] = useState('frontend'); // 'frontend' | 'backend' | 'response'
  const [responseLog, setResponseLog] = useState(null);

  // Terminal scroll reference
  const terminalContainerRef = useRef(null);

  // Initial loads and background polling
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => {
      refreshLogsAndStats();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleCustomSubmit = (e) => {
      executeApiFlow('post_message', e.detail);
    };
    window.addEventListener('mern-contact-submit', handleCustomSubmit);
    return () => window.removeEventListener('mern-contact-submit', handleCustomSubmit);
  });

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchInitialData = async () => {
    try {
      const msgsRes = await axios.get('/api/messages');
      setMessages(msgsRes.data);
      
      const statsRes = await axios.get('/api/status');
      setSystemStats(statsRes.data);

      const logsRes = await axios.get('/api/logs');
      setLogs(logsRes.data);
    } catch (err) {
      console.error('[PLAYGROUND] Init Load Error', err);
    }
  };

  const refreshLogsAndStats = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        axios.get('/api/logs'),
        axios.get('/api/status')
      ]);
      setLogs(logsRes.data);
      setSystemStats(statsRes.data);
    } catch (err) {
      // Keep server silent if user hasn't booted the backend yet
    }
  };

  // Main flow triggering handler
  const executeApiFlow = async (action, overrideData = null) => {
    if (flowStage !== 'idle') return; // wait for finished request
    
    setActiveAction(action);
    setErrorText('');
    setResponseLog(null);
    setIsLoading(true);

    const startTime = Date.now();
    
    // Step 1: Animation Client -> Server
    setFlowStage('client_to_server');
    await sleep(800);

    // Step 2: Animation Server -> Database (if not just server stats query)
    setFlowStage('server_to_db');
    await sleep(600);

    setFlowStage('db_processing');
    
    let responseData = null;
    let errorOccurred = false;
    let actualLatency = 0;

    try {
      if (action === 'get_messages') {
        const res = await axios.get('/api/messages');
        responseData = res;
        setMessages(res.data);
      } else if (action === 'post_message') {
        const body = overrideData || {
          name: formInput.name || "Test User",
          email: formInput.email || "tester@example.com",
          subject: formInput.subject || "General Inquire",
          message: formInput.message || "Hello MERN stack!"
        };
        const res = await axios.post('/api/messages', body);
        responseData = res;
        setMessages(prev => [res.data, ...prev]);
        
        // Reset local form if successful
        if (!overrideData) {
          setFormInput({ name: '', email: '', subject: 'Feedback', message: '' });
        }
      } else if (action === 'delete_message') {
        const res = await axios.delete(`/api/messages/${overrideData}`);
        responseData = res;
        setMessages(prev => prev.filter(m => m.id !== overrideData));
      } else if (action === 'slow_task') {
        const res = await axios.post('/api/test-controller', { delay: 1800 });
        responseData = res;
      } else if (action === 'error_task') {
        // Trigger simulated Express server crash
        const res = await axios.get('/api/error-test');
        responseData = res;
      } else if (action === 'get_status') {
        const res = await axios.get('/api/status');
        responseData = res;
        setSystemStats(res.data);
      }

      actualLatency = Date.now() - startTime;
      setNetworkLatency(actualLatency);
      setResponseLog({
        status: responseData?.status || 200,
        statusText: responseData?.statusText || 'OK',
        headers: responseData?.headers || { 'content-type': 'application/json' },
        data: responseData?.data
      });
      setInspectTab('response');
    } catch (err) {
      errorOccurred = true;
      actualLatency = Date.now() - startTime;
      setNetworkLatency(actualLatency);
      
      const errRes = err.response;
      setResponseLog({
        status: errRes?.status || 500,
        statusText: errRes?.statusText || 'Internal Server Error',
        headers: errRes?.headers || { 'content-type': 'application/json' },
        data: errRes?.data || { error: err.message }
      });
      
      setErrorText(errRes?.data?.message || errRes?.data?.error || err.message);
      setInspectTab('response');
    }

    // Step 3: Animating database returning results to Server
    setFlowStage('db_to_server');
    await sleep(600);

    // Step 4: Animating Server returning results to Client
    setFlowStage('server_to_client');
    await sleep(800);

    // Done
    setFlowStage('idle');
    setIsLoading(false);

    // Instantly update terminal logs
    refreshLogsAndStats();
  };

  const triggerReset = async () => {
    if (window.confirm("Are you sure you want to reset the database messages and terminal logs?")) {
      try {
        await axios.post('/api/reset');
        fetchInitialData();
      } catch (err) {
        console.error('Reset failed', err);
      }
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Determine active display DB schema
  const dbEngine = systemStats?.database?.engine || 'Local JSON File System';
  const isMongoDB = systemStats?.database?.dbMode === 'mongodb';

  // Packet animation helper coordinates
  const getParticleClass = () => {
    switch(activeAction) {
      case 'post_message': return 'bg-emerald-500 shadow-[0_0_12px_#10b981]';
      case 'delete_message': return 'bg-rose-500 shadow-[0_0_12px_#f43f5e]';
      case 'error_task': return 'bg-red-600 shadow-[0_0_12px_#dc2626] border-2 border-white animate-pulse';
      case 'slow_task': return 'bg-amber-500 shadow-[0_0_12px_#f59e0b]';
      case 'get_status': return 'bg-indigo-500 shadow-[0_0_12px_#6366f1]';
      default: return 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]';
    }
  };

  return (
    <div id="playground" className="py-24 border-b border-black/5 relative bg-white/40">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Title */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
          >
            <FaWifi className="animate-pulse" /> Live Simulator Dashboard
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 font-display mb-4"
          >
            The MERN <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Simulator</span> Playground
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-base leading-relaxed"
          >
            Trigger API endpoints below to visualize request packets traveling through Express routers to the database, and monitor live console outputs.
          </motion.p>
        </div>

        {/* -------------------- DYNAMIC ANIMATION PIPELINE CONTAINER -------------------- */}
        <div className="glass-premium rounded-3xl p-6 sm:p-8 mb-10 overflow-hidden relative border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white/70">
          
          {/* Top status indicator grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Server Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> ONLINE
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Active Database</span>
              <span className={`font-extrabold font-mono ${isMongoDB ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isMongoDB ? 'MongoDB Atlas' : 'JSON Fallback'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Response Latency</span>
              <span className="text-indigo-600 font-extrabold font-mono">
                {isLoading ? <FaSpinner className="inline animate-spin text-[10px]" /> : `${networkLatency}ms`}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Total Documents</span>
              <span className="text-purple-600 font-extrabold font-mono">
                {messages.length} Records
              </span>
            </div>
          </div>

          {/* Node Flow Map Wrapper */}
          <div className="relative flex flex-col md:flex-row justify-between items-center py-10 px-4 gap-12 md:gap-4 md:h-[220px]">
            
            {/* SVG Connecting Paths (Absolute Background overlay) */}
            <div className="absolute inset-0 w-full h-full hidden md:block pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                  </linearGradient>
                </defs>

                {/* Left Connector (React -> Express) */}
                <path 
                  d="M 220 110 L 480 110" 
                  stroke="url(#line-grad-1)" 
                  strokeWidth="3" 
                  strokeDasharray="6 4"
                  fill="none" 
                />

                {/* Right Connector (Express -> Database) */}
                <path 
                  d="M 620 110 L 890 110" 
                  stroke="url(#line-grad-2)" 
                  strokeWidth="3" 
                  strokeDasharray="6 4"
                  fill="none" 
                />
              </svg>
            </div>

            {/* FLOWING ANIMATED PARTICLE */}
            <AnimatePresence>
              {flowStage !== 'idle' && (
                <motion.div
                  className={`absolute w-5 h-5 rounded-full z-10 hidden md:flex items-center justify-center text-[10px] text-white font-bold ${getParticleClass()}`}
                  initial={{ left: "18%", top: "50%", x: -10, y: -10 }}
                  animate={
                    flowStage === 'client_to_server' ? { left: "48%" } :
                    flowStage === 'server_to_db' ? { left: "82%" } :
                    flowStage === 'db_processing' ? { left: "82%", scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 0.6 } } :
                    flowStage === 'db_to_server' ? { left: "48%" } :
                    flowStage === 'server_to_client' ? { left: "18%" } : {}
                  }
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  {activeAction === 'error_task' ? '!' : ''}
                </motion.div>
              )}
            </AnimatePresence>

            {/* NODE 1: REACT FRONTEND */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`w-64 glass rounded-2xl p-5 border relative z-20 flex flex-col items-center bg-white/70 shadow-sm ${
                flowStage === 'client_to_server' || flowStage === 'server_to_client'
                  ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'border-black/5'
              } transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-indigo-500 animate-neon-pulse m-3" />
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mb-3 shadow-[0_4px_10px_rgba(99,102,241,0.08)]">
                <SiReact className="animate-[spin_10s_linear_infinite]" />
              </div>
              <h3 className="font-display font-extrabold text-gray-900 tracking-wide text-sm">React Client</h3>
              <p className="text-indigo-600 text-xs font-mono mt-1 font-bold">Vite Server (Port 5173)</p>
              
              <div className="w-full mt-3 pt-3 border-t border-black/5 text-[10px] font-mono text-gray-400 flex flex-col gap-1.5 text-left">
                <div className="flex justify-between">
                  <span>useState(messages):</span>
                  <span className="text-indigo-600 font-bold">{messages.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>isLoadingState:</span>
                  <span className={isLoading ? "text-amber-500 font-bold" : "text-gray-400"}>{isLoading ? "true" : "false"}</span>
                </div>
              </div>
            </motion.div>

            {/* NODE 2: EXPRESS BACKEND */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`w-64 glass rounded-2xl p-5 border relative z-20 flex flex-col items-center bg-white/70 shadow-sm ${
                flowStage === 'server_to_db' || flowStage === 'db_to_server'
                  ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                  : 'border-black/5'
              } transition-all duration-300`}
            >
              <div className="absolute top-3 right-3 flex gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-purple-400 ${isLoading ? 'animate-led-pulse-fast bg-red-500' : 'animate-led-pulse-slow'}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-led-pulse-slow" />
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-2xl mb-3 shadow-[0_4px_10px_rgba(168,85,247,0.08)]">
                <SiExpress />
              </div>
              <h3 className="font-display font-extrabold text-gray-900 tracking-wide text-sm">Express Backend</h3>
              <p className="text-purple-600 text-xs font-mono mt-1 font-bold">Node API (Port 5000)</p>

              <div className="w-full mt-3 pt-3 border-t border-black/5 text-[10px] font-mono text-gray-400 flex flex-col gap-1.5 text-left">
                <div className="flex justify-between">
                  <span>req.middleware:</span>
                  <span className="text-purple-500 font-semibold">Logger & CORS</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Route:</span>
                  <span className="text-purple-600 font-bold truncate max-w-[100px]">
                    {activeAction ? '/' + activeAction.replace('_', '/') : 'idle'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* NODE 3: DATABASE STAGE */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`w-64 glass rounded-2xl p-5 border relative z-20 flex flex-col items-center bg-white/70 shadow-sm ${
                flowStage === 'db_processing'
                  ? isMongoDB 
                    ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-db-pulse'
                    : 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-db-pulse'
                  : 'border-black/5'
              } transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[9px] font-extrabold font-mono tracking-wider text-white ${isMongoDB ? 'bg-emerald-500 shadow-sm shadow-emerald-500/25' : 'bg-amber-500 shadow-sm shadow-amber-500/25'}`}>
                {isMongoDB ? 'MONGODB' : 'JSON FILE'}
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${
                isMongoDB 
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-[0_4px_10px_rgba(16,185,129,0.08)]'
                  : 'bg-amber-50 border border-amber-100 text-amber-600 shadow-[0_4px_10px_rgba(245,158,11,0.08)]'
              }`}>
                {isMongoDB ? <SiMongodb className="animate-bounce" /> : <FaDatabase />}
              </div>
              <h3 className="font-display font-extrabold text-gray-900 tracking-wide text-sm">Datastore Layer</h3>
              <p className={`text-xs font-mono mt-1 font-bold ${isMongoDB ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isMongoDB ? 'Cloud Cluster' : 'messages.json'}
              </p>

              <div className="w-full mt-3 pt-3 border-t border-black/5 text-[10px] font-mono text-gray-400 flex flex-col gap-1.5 text-left">
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className={isMongoDB ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{isMongoDB ? 'MongoDB Atlas' : 'fs reader'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Writes Path:</span>
                  <span className="text-gray-400 max-w-[120px] truncate text-right font-medium">
                    {isMongoDB ? 'Collection: messages' : '/data/messages.json'}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Trigger controls panel */}
          <div className="mt-8 pt-6 border-t border-black/5 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => executeApiFlow('get_messages')}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                activeAction === 'get_messages' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-indigo-400 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/5'
              }`}
            >
              <FaSync className={isLoading && activeAction === 'get_messages' ? 'animate-spin' : ''} />
              GET: Fetch Messages
            </button>

            <button
              onClick={() => executeApiFlow('get_status')}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                activeAction === 'get_status' 
                  ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-purple-400 text-gray-500 hover:text-purple-600 hover:bg-purple-50/5'
              }`}
            >
              <FaServer className={isLoading && activeAction === 'get_status' ? 'animate-spin' : ''} />
              GET: Server Status
            </button>

            <button
              onClick={() => executeApiFlow('slow_task')}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                activeAction === 'slow_task' 
                  ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-amber-400 text-gray-500 hover:text-amber-600 hover:bg-amber-50/5'
              }`}
            >
              <FaClock className={isLoading && activeAction === 'slow_task' ? 'animate-spin' : ''} />
              POST: Simulate Latency
            </button>

            <button
              onClick={() => executeApiFlow('error_task')}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                activeAction === 'error_task' 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-rose-400 text-gray-500 hover:text-rose-600 hover:bg-rose-50/5'
              }`}
            >
              <FaExclamationTriangle className={isLoading && activeAction === 'error_task' ? 'animate-bounce' : ''} />
              GET: Trigger 500 Error
            </button>

            <button
              onClick={triggerReset}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 border bg-white border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200 cursor-pointer"
            >
              <FaTrash />
              Reset Datastore
            </button>
          </div>

        </div>

        {/* -------------------- 3-PANEL VIEWPORT GRID -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PANEL 1: CLIENT PAYLOAD & DOCUMENTS */}
          <div className="flex flex-col gap-8">
            
            {/* Form */}
            <div className="glass rounded-3xl p-6 border border-black/5 flex-1 bg-white/70 shadow-sm text-left">
              <h3 className="text-lg font-extrabold font-display text-gray-900 mb-4 flex items-center gap-2">
                <FaPaperPlane className="text-indigo-500 text-sm" /> 
                Simulator Payload
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-1.5">Sender Name</label>
                  <input
                    type="text"
                    value={formInput.name}
                    onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                    placeholder="E.g., Jane Doe"
                    disabled={isLoading}
                    className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formInput.email}
                    onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                    placeholder="jane@example.com"
                    disabled={isLoading}
                    className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-1.5">Your Message</label>
                  <textarea
                    value={formInput.message}
                    onChange={(e) => setFormInput({ ...formInput, message: e.target.value })}
                    placeholder="Type details..."
                    disabled={isLoading}
                    rows="3"
                    className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none font-sans"
                  />
                </div>

                <button
                  onClick={() => executeApiFlow('post_message')}
                  disabled={isLoading || !formInput.name || !formInput.email || !formInput.message}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 disabled:border-gray-200 text-white disabled:bg-none font-bold rounded-xl py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-black/5 shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-all duration-200 cursor-pointer"
                >
                  {isLoading && activeAction === 'post_message' ? (
                    <FaSpinner className="animate-spin text-white" />
                  ) : (
                    <FaPaperPlane className="text-white" />
                  )}
                  POST: Submit Payload
                </button>
              </div>
            </div>

            {/* Documents list */}
            <div className="glass rounded-3xl p-6 border border-black/5 h-[340px] flex flex-col bg-white/70 shadow-sm text-left">
              <h3 className="text-lg font-extrabold font-display text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FaFolderOpen className="text-amber-500 text-sm" /> 
                  Documents Console
                </span>
                <span className="text-[10px] font-bold font-mono text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full">
                  {messages.length} documents
                </span>
              </h3>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
                    <FaFolderOpen className="text-3xl text-gray-200 mb-2 animate-bounce" />
                    <p className="text-xs font-mono">No documents found. Fetch or POST payloads.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      layoutId={msg.id}
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-white border border-gray-150 hover:border-indigo-400 text-xs transition-all duration-200 flex justify-between items-start gap-2 relative group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <span className="font-extrabold text-gray-900 text-[11px] truncate max-w-[80px]">{msg.name}</span>
                          <span className="text-[9px] text-gray-400 font-mono font-medium truncate max-w-[90px]">{msg.email}</span>
                          <span className="text-[8px] text-gray-400 font-mono ml-auto">
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-gray-500 font-sans leading-relaxed text-[11px] line-clamp-2 italic pr-6 group-hover:text-gray-600">
                          "{msg.message}"
                        </p>
                      </div>
                      
                      <button
                        onClick={() => executeApiFlow('delete_message', msg.id)}
                        disabled={isLoading}
                        title="Delete Document"
                        className="p-1.5 rounded-lg bg-red-50 border border-red-150 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer absolute right-3 top-3"
                      >
                        <FaTrash className="text-[9px]" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* COLUMN 2: SERVER SHELL LOGS (Preserved Dark Contrast for dev styling) */}
          <div className="glass rounded-3xl p-6 border border-black/5 flex flex-col h-[670px] relative bg-white/70 shadow-sm text-left">
            <div className="absolute top-4 right-4 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500" />
            </div>
            
            <h3 className="text-lg font-extrabold font-display text-gray-900 mb-2 flex items-center gap-2">
              <FaTerminal className="text-indigo-600 text-sm" /> 
              Express Shell logs
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-mono font-semibold">Intercepted server-side stdout streams:</p>

            {/* Dark monospace screen */}
            <div ref={terminalContainerRef} className="flex-1 bg-[#05070c] border border-black/40 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 shadow-inner select-text">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-700">
                  <span className="animate-pulse">_ Connecting to node server pipeline...</span>
                </div>
              ) : (
                logs.map((log, index) => {
                  let statusColor = "text-emerald-400";
                  if (log.status >= 500) statusColor = "text-rose-500 font-bold";
                  else if (log.status >= 400) statusColor = "text-amber-500 font-bold";
                  else if (log.status === 201) statusColor = "text-green-400";
                  else if (log.status === 'SYSTEM') statusColor = "text-indigo-400";

                  const timestamp = new Date(log.timestamp).toLocaleTimeString([], { hour12: false });

                  return (
                    <div key={log.id || index} className="border-b border-white/5 pb-2">
                      <span className="text-gray-600 font-medium font-mono text-[9px] select-none">
                        [{timestamp}]
                      </span>{' '}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase mr-1.5 ${
                        log.method === 'GET' ? 'bg-cyan-950/60 border border-cyan-500/20 text-cyan-400' :
                        log.method === 'POST' ? 'bg-emerald-950/60 border border-emerald-500/20 text-emerald-400' :
                        log.method === 'DELETE' ? 'bg-rose-950/60 border border-rose-500/20 text-rose-400' :
                        'bg-indigo-950/60 border border-indigo-500/20 text-indigo-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-gray-300 font-medium">{log.path}</span>{' '}
                      <span className={`${statusColor}`}>{log.status}</span>{' '}
                      <span className="text-cyan-400/80 float-right font-semibold font-mono">{log.latency > 0 ? `${log.latency}ms` : ''}</span>
                      <p className="text-gray-500 text-[10px] mt-1 pr-4 leading-normal select-text selection:bg-emerald-400/20 font-sans">
                        {log.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: INTERACTIVE CODE INSPECTOR PANEL (Preserved Dark Contrast) */}
          <div className="glass rounded-3xl p-6 border border-black/5 flex flex-col h-[670px] bg-white/70 shadow-sm text-left">
            <h3 className="text-lg font-extrabold font-display text-gray-900 mb-2 flex items-center gap-2">
              <FaCode className="text-purple-600 text-sm" /> 
              Diagnostic inspector
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-mono font-semibold">Inspect raw payload responses or node structures:</p>

            {/* Tab links */}
            <div className="flex bg-gray-100 p-1 border border-gray-200 rounded-xl mb-4 gap-1">
              <button
                onClick={() => setInspectTab('frontend')}
                className={`flex-1 py-2 text-center text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer ${
                  inspectTab === 'frontend' 
                    ? 'bg-white border border-gray-250 text-indigo-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                React Client
              </button>
              <button
                onClick={() => setInspectTab('backend')}
                className={`flex-1 py-2 text-center text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer ${
                  inspectTab === 'backend' 
                    ? 'bg-white border border-gray-250 text-purple-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Express API
              </button>
              <button
                onClick={() => setInspectTab('response')}
                className={`flex-1 py-2 text-center text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer relative ${
                  inspectTab === 'response' 
                    ? 'bg-white border border-gray-250 text-purple-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                JSON Payload
                {responseLog && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </button>
            </div>

            {/* Dark Monospace Inspector Screen */}
            <div className="flex-1 bg-[#05070c] border border-black/40 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-gray-400 overflow-y-auto custom-scrollbar flex flex-col shadow-inner select-text">
              <AnimatePresence mode="wait">
                {inspectTab === 'frontend' && (
                  <motion.div
                    key="frontend-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      <span className="block text-gray-600 mb-2 border-b border-white/5 pb-2 text-[10px] uppercase font-bold">
                        // HTTP client action: AXIOS
                      </span>
                      <pre className="text-cyan-400/90 whitespace-pre-wrap leading-5">
                        {CODE_TEMPLATES[activeAction]?.frontend || '// Select an API endpoint above to inspect code structure'}
                      </pre>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-gray-600 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span>Library:</span>
                        <span className="text-cyan-400">axios v1.16.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="text-cyan-400 font-bold uppercase">{activeAction.includes('post') ? 'POST' : activeAction.includes('delete') ? 'DELETE' : 'GET'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {inspectTab === 'backend' && (
                  <motion.div
                    key="backend-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      <span className="block text-gray-600 mb-2 border-b border-white/5 pb-2 text-[10px] uppercase font-bold">
                        // Express API Route handler
                      </span>
                      <pre className="text-indigo-300 whitespace-pre-wrap leading-5">
                        {CODE_TEMPLATES[activeAction]?.backend || '// Select an API endpoint above to inspect code structure'}
                      </pre>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-gray-600 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span>Framework:</span>
                        <span className="text-indigo-400">Express Router</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Middleware stack:</span>
                        <span className="text-indigo-400 font-bold">loggerMiddleware</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {inspectTab === 'response' && (
                  <motion.div
                    key="response-json"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      <span className="block text-gray-600 mb-2 border-b border-white/5 pb-2 text-[10px] uppercase font-bold flex items-center justify-between">
                        <span>// API HTTP Server response</span>
                        {responseLog && (
                          <span className={`px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase ${
                            responseLog.status >= 500 ? 'bg-red-950/60 border border-red-500/20 text-red-400' :
                            responseLog.status >= 400 ? 'bg-amber-950/60 border border-amber-500/20 text-amber-400' :
                            'bg-emerald-950/60 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            Status: {responseLog.status} {responseLog.statusText}
                          </span>
                        )}
                      </span>
                      
                      {responseLog ? (
                        <div className="space-y-4">
                          <div>
                            <span className="block text-gray-600 text-[9px] mb-1 font-bold">RESPONSE HEADERS</span>
                            <pre className="text-gray-500 text-[10px]">
                              {JSON.stringify(responseLog.headers, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="block text-gray-600 text-[9px] mb-1 font-bold">PAYLOAD RESPONSE</span>
                            <pre className={`whitespace-pre-wrap leading-4 ${errorText ? 'text-red-400' : 'text-purple-400'}`}>
                              {JSON.stringify(responseLog.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-center text-gray-700 italic text-xs">
                          No transactions captured yet. Trigger a simulated call above!
                        </div>
                      )}
                    </div>

                    {responseLog && (
                      <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-gray-600 flex flex-col gap-1.5 font-mono">
                        <div className="flex justify-between">
                          <span>Transmission Latency:</span>
                          <span className="text-purple-400 font-bold">{networkLatency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Transfer Size:</span>
                          <span className="text-purple-400">
                            {JSON.stringify(responseLog.data).length >= 1024 
                              ? `${(JSON.stringify(responseLog.data).length / 1024).toFixed(2)} KB`
                              : `${JSON.stringify(responseLog.data).length} B`}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
