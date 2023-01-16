
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

module.exports = {
  handleProfileGet: handleProfileGet
}