const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

console.log(process.env.CLARIFY_PAT);
console.log(process.env.POSTGRES_PASSWORD);

app.use(express.json());

const db  = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'lofasz',
    database : 'smart-brain'
  }
});

// connect to the database
db.select('*').from('users').then(data => {
  //console.log(data);
});


const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    },
    {
      id: '125',
      name: 'f',
      email: 'f',
      password: 'f',
      entries: 0,
      joined: new Date()

    }
  ],
};

// MIDDLEWARE
app.use(cors());

// / --> GET = this is working
app.get('/', (req, res) => {
  res.send(database.users);
});

// /signin --> POST = success/fail
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));

// /register --> POST = user
// dependency injection, we inject the database and the bcrypt library into the register.js file so we don't have to import it there
app.post('/register', (req, res) => register.handleRegsiter(req, res, db, bcrypt));

// /profile/:userId --> GET = user
app.get('/profile/:userId', (req, res) => profile.handleProfileGet(req, res, db));

// /image --> PUT (updating the number of pics a user submitted so that we know the ranking) --> user
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

// PORT

app.listen(3000, () => console.log(`Server is running on port 3000`));
