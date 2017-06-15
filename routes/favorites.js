'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

const authorize = function(req, res, next) {
  if (!req.session.userId) {
    return next({
      status: 401,
      message: 'Unauthorized'
    });
  }

  next();
};

router.get('/favorites', authorize, (req, res, next) => {
  const userId = req.session.userId;

  if (userId !== undefined) {
    knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('favorites.user_id', userId)
      .orderBy('books.title', 'ASC')
      .then((favorites) => {
        res.status(200).json(favorites);
      })
      .catch((err) => {
        next(err);
      })
  }
  else {
    res.status(400).send('Bad Request');
  }
});

router.get('/favorites/check', authorize, (req, res, next) => {
  const { userId } = req.session;
  const bookId = req.query.book_id;

  if (userId !== undefined && bookId !== undefined && !isNaN(bookId)) {
    knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('favorites.user_id', userId)
      .andWhere('books.id', bookId)
      .first()
      .orderBy('books.title', 'ASC')
      .then((favorites) => {
        if (favorites) {
          res.status(200).json(true);
        } else {
          res.status(200).json(false);
        }
      })
  }
  else {
    res.status(400).send('Bad Request');
  }
});

router.post('/favorites', authorize, (req, res, next) => {
  const { userId } = req.session
  const newItem = req.body
  const newFavId = req.body.book_id

knex('favorites')
  .insert({book_id: newFavId, user_id: userId}, "*")
  .returning(['id', 'book_id', 'user_id'])
  .then((result) => {
    let sendBack = result[0]
    res.status(200).json(sendBack)
  })
  .catch((err) => {
    next(err)
  })
})

router.delete('/favorites', authorize, (req, res, next) => {
  const { userId } = req.session
  const id = req.body.book_id

  if (!userId) {
    return next({
      status: 401,
      message: 'Unauthorized'
    })
  }
    knex('favorites')
    .where('id', id)
    .delete()
    .returning(['book_id', 'user_id'])
    .then((result) => {
      res.json(result[0]);
    })
})

module.exports = router;
