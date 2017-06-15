'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap
const router = express.Router();

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
    // console.log(users);
    if (users.length) {
      return next({
        status: 400,
        message: 'Email already exists'
      });
    }

    return bcrypt.hash(req.body.password, 12);
  })
  .then((hashed_password) => {

    return knex('users')
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      hashed_password: hashed_password
    }, '*');
  })
  .then((rows) => {
    const user = rows[0];

    delete user.hashed_password;
    req.session.userId = user.id;
    // res.setHeader('content-type', 'json');
    // res.send(user);
    res.json(user)
  })
  .catch((err) => {
    next(err);
  });
});


module.exports = router;
// /* eslint-disable */
// 'use strict'
//
// const express = require('express')
// const knex = require('../knex')
// const bcrypt = require('bcrypt-as-promised')
// const router = express.Router()
//
// // YOUR CODE HERE
// router.post('/users', (req, res, next) => {
//   bcrypt.hash(req.body.password, 12)
//   .then((hashed_password) => {
//     return knex('users')
//     .insert({
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       email: req.body.email,
//       hashed_password: hashed_password
//     }, '*')
//   })
//   .then((users) => {
//     const user = users[0]
//     delete user.hashed_password
//     req.session.userId = user.id
//     res.json(user)
//   })
//   .catch((err) => {
//     console.log(err);
//     next(err)
//   })
// })
// module.exports = router;
