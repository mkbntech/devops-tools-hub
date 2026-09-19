const path = require('path');

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'devops-tools-hub',
  version: '1.0.0',
  databaseUrl: process.env.DATABASE_URL || null,
  sqlitePath: process.env.SQLITE_PATH || path.join(__dirname, '..', '..', 'data', 'devops-tools.db'),
  siteTitle: 'DevOps & Cloud Native Tools Hub',
  siteSubtitle: 'The Definitive Guide to World-Class Open Source Tools for Cloud, DevOps & Platform Engineering'
};

module.exports = config;
