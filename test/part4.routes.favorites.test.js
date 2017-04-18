/* eslint-disable max-nested-callbacks */

'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');
const knex = require('../knex');
const server = require('../server');

suite('part4 routes favorites', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  suite('with session', () => {
    const agent = request.agent(server);

    beforeEach((done) => {
      knex.seed.run()
        .then(() => {
          request(server)
            .post('/session')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
              email: 'jkrowling@gmail.com',
              password: 'youreawizard'
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              agent.saveCookies(res);
              done();
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    test('GET /favorites', (done) => {
      /* eslint-disable max-len */
      agent
        .get('/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, [{
          id: 1,
          book_id: 1,
          user_id: 1,
          created_at: '2016-06-26T14:26:16.000Z',
          updated_at: '2016-06-26T14:26:16.000Z',
          title: 'JavaScript The Good Parts',
          author: 'Douglas Crockford',
          genre: 'JavaScript',
          description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that\'s more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code.',
          cover_url: 'https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/284/javascript_the_good_parts.jpg'
        }], done);

      /* eslint-enable max-len */
    });

    test('GET /favorites/check?book_id=1', (done) => {
      agent
        .get('/favorites/check?book_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, 'true', done);
    });

    test('GET /favorites/check?book_id=2', (done) => {
      agent
        .get('/favorites/check?book_id=2')
        .set('Accept', 'application/json')
        .expect(200, 'false', done);
    });

    test('POST /favorites', (done) => {
      agent
        .post('/favorites')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ book_id: 2 })
        .expect('Content-Type', /json/)
        .expect((res) => {
          delete res.body.created_at;
          delete res.body.updated_at;
        })
        .expect(200, { id: 2, book_id: 2, user_id: 1 }, done);
    });

    test('DELETE /favorites', (done) => {
      agent
        .delete('/favorites')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ book_id: 1 })
        .expect('Content-Type', /json/)
        .expect((res) => {
          delete res.body.created_at;
          delete res.body.updated_at;
        })
        .expect(200, { book_id: 1, user_id: 1 }, done);
    });
  });

  suite('without session', () => {
    before((done) => {
      knex.migrate.latest()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    beforeEach((done) => {
      knex.seed.run()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('GET /favorites', (done) => {
      request(server)
        .get('/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(401, 'Unauthorized', done);
    });

    test('GET /favorites/check?book_id=1', (done) => {
      request(server)
        .get('/favorites/check?book_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(401, 'Unauthorized', done);
    });

    test('GET /favorites/check?book_id=2', (done) => {
      request(server)
        .get('/favorites/check?book_id=2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(401, 'Unauthorized', done);
    });

    test('POST /favorites', (done) => {
      request(server)
        .post('/favorites')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ book_id: 2 })
        .expect('Content-Type', /plain/)
        .expect(401, 'Unauthorized', done);
    });

    test('DELETE /favorites', (done) => {
      request(server)
        .del('/favorites')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ book_id: 1 })
        .expect('Content-Type', /plain/)
        .expect(401, 'Unauthorized', done);
    });
  });
});
