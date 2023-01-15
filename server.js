const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/signin', (req, res) => {
  // if(req.body.email === database.users[2].email &&
  //   req.body.password === database.users[2].password) {
  //   res.json(database.users[2]);
  // } else {
  //   res.status(400).json('error logging in');
  // }

  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
    console.log(isValid)
    if(isValid) {
      return db.select('*').from('users').where('email', '=', req.body.email)
      .then(user => {
        res.json(user[0])
      })
      .catch(err => res.status(400).json('unable to get user'))
    } else {
      res.status(400).json('wrong credentials')
    }
  })
  .catch(err => res.status(400).json('wrong credentials'))
  
});

// /register --> POST = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  console.log('body', req.body)
  console.log('password', password)
  const hash = bcrypt.hashSync(password);

  // tricky syntax, because first we insert the new user, and returning('*') means that we get back the whole user object, and then we can use it in the response

  //transactions are used when we want to do multiple things at once, and if one of them fails, we want to rollback the whole thing
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email 
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        }).then(user =>  {
          res.json(user[0]);

        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'));

  }
);

// /profile/:userId --> GET = user
app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;

  // grab the user from the database
  db.select('*').from('users').where({id: userId}).then(user => {
    // javascript trick, if the user is not empty, then we can return the user
    if(user.length) {
    res.json(user[0]);
  } else {
    res.status(400).json('not found');
  }
  }).catch(err => res.status(400).json('error getting user'));
});

// /image --> PUT (updating the number of pics a user submitted so that we know the ranking) --> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries)
  })
  .catch(err => res.status(400).json('unable to get entries'));

});

// PORT
app.listen(3000, () => console.log('Server is running on port 3000'));
