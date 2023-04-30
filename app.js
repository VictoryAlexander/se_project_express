const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const { PORT = 3001 } = process.env;
const app = express();
const routes = require('./routes')
const limiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})