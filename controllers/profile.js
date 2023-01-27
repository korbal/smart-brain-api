const handleProfileGet = (req, res, db) => {
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
}

const handleProfileUpdate = (req, res, db) => {
  const id  = req.params.userId;

  console.log('req', req.body)
  console.log('id', id)
  const { name, age, pet } = req.body.formInput;
  db('users')
    .where({id})
    .update({name})
    .then(resp => {
      if(resp) {
        res.json('success');
      } else {
        res.status(400).json('unable to update');
      }
    })
    .catch(err => res.status(400).json('error updating user'));
}

module.exports = {
  handleProfileGet: handleProfileGet,
  handleProfileUpdate: handleProfileUpdate
}