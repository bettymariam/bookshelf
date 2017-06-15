'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');
const router = express.Router();

router.get('/session', (req, res) => {
  if (req.session.userId) {
    //res.status(200).send(true);
    res.json(true)
  }
  else {
    //res.status(200).send(false);
    res.json(false)
  }
});

router.post('/session', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next({
      status: 400,
      message: 'Email must not be blank'
    });
  }

  if (!password) {
    return next({
      status: 400,
      message: 'Password must not be blank'
    });
  }

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw {
          status: 400,
          message: 'Bad email or password'
        };
      }

      user = row;

      return bcrypt.compare(password, user.hashed_password);
    })
    .then(() => {
      delete user.hashed_password;
      req.session.userId = user.id;
      res.json(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw {
        status: 400,
        message: 'Bad email or password'
      };
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/session', (req, res) => {
  req.session = null;
  res.json(true);
});

module.exports = router;
