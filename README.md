# bookshelf
A RESTful, database-driven, HTTP server with user registration, authentication and authorization built using node, Express and Materialize.
This project was built during my time at Galvanize in their 6 month Web Development Immersive as part of an assignment. I added the back end with routes, migratons, seeds and used knex for queries. Also added user registration, authentication and authorization.

Technologies used:
* Materialize
* Node
* express
* google maps API
* Knex js
* PostgrSQL
* Heroku

Project Members:
* Betty Chempananical
* Ken McGrady

Installation Instructions:
Fork and clone
Run NPM Install
Create a postgresql database called bookshelf_dev
  ```
  createdb bookshelf_dev
  ```
Run migration files:
  ```
  npm run knex migrate:latest
  ```
Run seed files:
  ```
  npm run knex seed:run
  ```
Start server
  ```
  npm start
  ```
In a browser navigate to:
  ```
  localhost:3000
  ```
