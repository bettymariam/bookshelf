'use strict';

const express = require('express');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, cover_url } = req.body;

  if (!title || !title.trim()) {
    return next({
      status: 400,
      message: 'Title must not be blank'
    });
  }

  if (!author || !author.trim()) {
    return next({
      status: 400,
      message: 'Author must not be blank'
    });
  }

  if (!genre || !genre.trim()) {
    return next({
      status: 400,
      message: 'Genre must not be blank'
    });
  }

  if (!description || !description.trim()) {
    return next({
      status: 400,
      message: 'Description must not be blank'
    });
  }

  if (!cover_url || !cover_url.trim()) {
    return next({
      status: 400,
      message: 'Cover URL must not be blank'
    });
  }

  const insertBook = { title, author, genre, description, cover_url };

  knex('books')
    .insert(insertBook, '*')
    .then((rows) => {
      const book = rows[0];

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }

      const { title, author, genre, description, cover_url } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (cover_url) {
        updateBook.cover_url = cover_url;
      }

      return knex('books')
        .update(updateBook, '*')
        .where('id', id);
    })
    .then((rows) => {
      const book = rows[0];

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  let book;

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }

      book = row;

      return knex('books')
        .del()
        .where('id', id);
    })
    .then(() => {
      delete book.id;

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
