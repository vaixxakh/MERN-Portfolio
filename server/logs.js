const MAX_LOGS = 50;
let requestLogs = [
  {
    id: "log_init_1",
    timestamp: new Date(Date.now() - 5000).toISOString(),
    method: "SYSTEM",
    path: "/db/init",
    status: 200,
    latency: 12,
    size: "0 B",
    message: "Express backend initialized and listening on port 5000."
  }
];

export const getLogs = () => {
  return requestLogs;
};

export const clearLogs = () => {
  requestLogs = [
    {
      id: "log_reset",
      timestamp: new Date().toISOString(),
      method: "SYSTEM",
      path: "/db/reset",
      status: 200,
      latency: 1,
      size: "0 B",
      message: "Server logs and databases reset successfully."
    }
  ];
};

export const addLog = (log) => {
  const newLog = {
    id: 'log_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    ...log
  };
  requestLogs.push(newLog);
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.shift();
  }
  return newLog;
};

export const loggerMiddleware = (req, res, next) => {
  // Skip logging logs queries themselves to prevent circular infinite logs
  if (req.path === '/api/logs' || req.path === '/api/status') {
    return next();
  }

  const startTime = process.hrtime();
  
  // Track when request finishes
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const latencyMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
    
    // Estimate size of response
    const sizeBytes = res.get('Content-Length') || '0';
    const sizeFormatted = sizeBytes >= 1024 
      ? `${(parseInt(sizeBytes) / 1024).toFixed(1)} KB`
      : `${sizeBytes} B`;

    const logEntry = {
      method: req.method,
      path: req.originalUrl || req.path,
      status: res.statusCode,
      latency: latencyMs,
      size: sizeFormatted,
      message: `${req.method} request to ${req.path} resolved with status ${res.statusCode} in ${latencyMs}ms.`
    };

    addLog(logEntry);
  });

  next();
};
