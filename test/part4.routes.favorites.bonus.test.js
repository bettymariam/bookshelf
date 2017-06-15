// 'use strict';
//
// process.env.NODE_ENV = 'test';
//
// const { suite, test } = require('mocha');
// const request = require('supertest');
// const knex = require('../knex');
// const server = require('../server');
//
// suite('part4 routes favorites bonus', () => {
//   const agent = request.agent(server);
//
//   before((done) => {
//     knex.migrate.latest()
//       .then(() => {
//         done();
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });
//
//   after((done) => {
//     knex.migrate.rollback()
//       .then(() => {
//         done();
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });
//
//   beforeEach((done) => {
//     knex.seed.run()
//       .then(() => {
//         request(server)
//           .post('/session')
//           .set('Accept', 'application/json')
//           .set('Content-Type', 'application/json')
//           .send({
//             email: 'jkrowling@gmail.com',
//             password: 'youreawizard'
//           })
//           .end((err, res) => {
//             if (err) {
//               return done(err);
//             }
//
//             agent.saveCookies(res);
//             done();
//           });
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });
//
//   test('GET /favorites/check?book_id=one', (done) => {
//     agent
//       .get('/favorites/check?book_id=one')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /plain/)
//       .expect(400, 'Book ID must be an integer', done);
//   });
//
//   test('POST /favorites with non-integer book_id', (done) => {
//     agent
//       .post('/favorites')
//       .set('Accept', 'application/json')
//       .send({ book_id: 'two' })
//       .expect('Content-Type', /plain/)
//       .expect(400, 'Book ID must be an integer', done);
//   });
//
//   test('POST /favorites with unknown book_id', (done) => {
//     agent
//       .post('/favorites')
//       .set('Accept', 'application/json')
//       .send({ book_id: 9000 })
//       .expect('Content-Type', /plain/)
//       .expect(404, 'Book not found', done);
//   });
//
//   test('DELETE /favorites with non-integer book_id', (done) => {
//     agent
//       .del('/favorites')
//       .set('Accept', 'application/json')
//       .send({ book_id: 'one' })
//       .expect('Content-Type', /plain/)
//       .expect(400, 'Book ID must be an integer', done);
//   });
//
//   test('DELETE /favorites with unknown favorite', (done) => {
//     agent
//       .del('/favorites')
//       .set('Accept', 'application/json')
//       .send({ book_id: 9000 })
//       .expect('Content-Type', /plain/)
//       .expect(404, 'Favorite not found', done);
//   });
// });
