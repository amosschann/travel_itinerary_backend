const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const travelsRouter = require('./routes/Travels')

const app = express();
// Enable CORS
app.use(cors());

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//API endpoints
app.use('/api/auth/', authRouter);
app.use('/api/users/', usersRouter)
app.use('/api/travels/', travelsRouter)


module.exports = app;
