const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
      name: 'fasz',
      email: 'fasz',
      password: 'ff',
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
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

// /register --> POST = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    
    entries: 0,
    joined: new Date()
  });
 
  res.json(database.users[database.users.length - 1]);}
);

// /profile/:userId --> GET = user
app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === userId) {
      found = true;
      return res.json(user);
    }
  });
  if(!found) {
    res.status(400).json('not found');
  }
});

// /image --> PUT (updating the number of pics a user submitted so that we know the ranking) --> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if(!found) {
    res.status(400).json('not found');
  }
});

// PORT
app.listen(3000, () => console.log('Server is running on port 3000'));
