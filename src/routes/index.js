const express = require('express');

const indexRouter = express.Router();

indexRouter.get('/', (req, res) =>
  res.status(200).json({ message: 'Welcome to Express API template' })
);

module.exports = indexRouter;