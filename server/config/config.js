require('dotenv').config({ path: '../../.env' });

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_FILE: process.env.DB_FILE || './server/db.db',
  JWT_SECRET: process.env.JWT_SECRET
};
