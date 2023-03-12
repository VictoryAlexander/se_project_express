const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const { PORT = 3001 } = process.env;
const app = express();
const routes = require('./routes')
const { limiter } = require('./middleware/rateLimiter');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(helmet());
app.use(cors());
//app.use(limiter);
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})