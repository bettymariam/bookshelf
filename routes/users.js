'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/users', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !email.trim()) {
    return next({
      status: 400,
      message: 'Email must not be blank'
    });
  }

  if ((!password) || (password.length < 8)) {
    return next({
      status: 400,
      message: 'Password must be at least 8 characters long'
    });
  }

  knex('users')
  .where('email', email)
  .then((users) => {
    if (users[0]) {
      return next({
        status: 400,
        message: 'Email already exists'
      });
    }
  });

  bcrypt.hash(password, 12)
    .then((hashed_password) => {
      return knex('users')
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email,
        hashed_password
      }, '*');
    })
    .then((users) => {
      const user = users[0];

      delete user.hashed_password;
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
