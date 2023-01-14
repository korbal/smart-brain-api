const express = require('express');
const app = express();

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
    }
  ],
};

app.get('/', (req, res) => {
  res.send('Hello World!');
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


app.listen(3000, () => console.log('Server is running on port 3000'));

/*
/--> res = this is working

/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT (updating the number of pics a user submitted so that we know the ranking) --> user
*/