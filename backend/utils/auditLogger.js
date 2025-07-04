const fs = require('fs');
const path = require('path');
const logFile = './audit.log';

exports.log = (event, meta = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...meta,
  };
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};
