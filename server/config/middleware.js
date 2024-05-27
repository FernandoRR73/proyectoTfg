const express = require('express');
const cors = require('cors');

const configureMiddleware = (app) => {
  app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true
  }));
  app.use(express.json());
};

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: 'No está autorizado' });
};

module.exports = {
  configureMiddleware,
  isAuthenticated
};
