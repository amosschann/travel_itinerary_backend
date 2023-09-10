const express = require('express');
const authRouter = express.Router();
const database= require('../helpers/database');
const { handleServerError } = require('../helpers/errorHelper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const fs = require('fs');


/*Auth*/
//without middleware
authRouter.post('/signIn', (req, res) => {
  const { email, password } = req.body;

  try {
    //check for valid email
    let userQuery = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    database.query(userQuery, email, (err, result) => {
      if (err) {
        handleServerError(res, err);
      } else {
        if (result.length === 0) {
          res.status(500).json({ message: 'incorrect email' });
        } else {
          //compare to password hash
          const hashedPassword = result[0].password;
          const id = result[0].id;
          bcrypt.compare(password, hashedPassword, function(err, result) {
          if (result === true) {
            console.log('successful user Sign In');
            //generate JWT token
            const aYearFromNow = Math.floor(Date.now() / 1000) + 31536000; // 31536000 seconds in a year
            const privateKey = fs.readFileSync('../private.pem', 'utf8');
            const accessToken = jwt.sign({ username: email, user_id: id,  exp: aYearFromNow }, privateKey);

            res.status(200).json({ message: 'User Sign In Successful', accessToken: accessToken });
          } else {
            console.log(result, err);
            res.status(500).json({ message: 'incorrect password' });
          }
        });
        }
      }
    });
  } catch (err) {
    handleServerError(res, err);
  }
});

module.exports = authRouter;