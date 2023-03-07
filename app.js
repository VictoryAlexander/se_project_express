const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3001 } = process.env;
const app = express();
const routes = require('./routes')
const { limiter } = require('./middleware/rateLimiter');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133'
  };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})