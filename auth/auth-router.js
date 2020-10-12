const router = require('express').Router();
const  bcrypt = require('bcryptjs');
//bcrypt is the library used to hash our passwords
//hashing just means that we can store it as something other than what it actually is 

const Users = require('../user/user-model.js')
const jwt = require('jsonwebtoken');
const{jwtSecret} = require('../config/secrets')

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 10)
  //hashSync  is keeping the users password and hassing it.  
  //n = 10  means it 2^n salt rounds, how many times it will be hashed
  //the salt rounds mean the "cost factor"
  //the cost factor is essentially how much time is needed to calculate a single bcrypt hash
  //the higher the cost factor, the more hashing rounds are done, increase the cost factor by double the neccessary time for every increase by 1
  //the more time spent hashing it, the more difficult it is to brute force
  //password: orange => grenggkjb2342sw
  //1. Hashing - process of converting  a given key into another value 
  //2. salting (both manual and automatic) - salting is a unique value that can be added to the end of a password to create a different hash value 
  //3. accumulative hashing rounds 
  user.password = hash;
  Users.add(user)
  .then((saved) => {
    res.status(201).json(saved)
  })
.catch((error) => {
  res.status(500).json(error)
})

});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body 
  Users.findBy({ username })
  .first()
  .then((user) => {
    if (user && bcrypt.compareSync(password, user.password)){
      const token = generateToken(user); //get a token
      res.status(200).json({
        message:`Welcome ${user.username}`, 
        token,//send the token to user
      })
    }else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  })
  .catch((error) => {
    res.status(500).json(error);
  })
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
    lat: Date.now()
  }
const options = {
  expiresIn: "1h"
};
return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
