
const handleRegsiter = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  console.log('--------register---------')
  console.log('body', req.body)
  console.log('--------register---------')
  
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

  module.exports = {
    handleRegsiter: handleRegsiter
  }
