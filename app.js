const express = require('express')
const jwt     = require('jsonwebtoken')

const app = express()

app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to the API"
  })
  return
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err){
      res.status(403).json({
        message: "access forbidden due to incorrect or non-existent token"
      })
    }else{
      res.json({
        message: "Post Created...",
        authData
      })
      return
    }
  })
})

app.post('/api/login', (req, res) => {
  // Mock User
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad@gmail.com'
  }
  jwt.sign({user}, 'secretkey', { expiresIn: '60min' }, (err, token) => {
    res.json({token})
  })
})

// verify token
function verifyToken(req, res, next){
  //get auth header value
  const bearerHeader = req.headers['authorization']
  // check if bearer is undefined
  if( typeof bearerHeader != "undefined" ){
    const bearer = bearerHeader.split(' ')
    // get token from array
    const bearerToken = bearer[1]
    // Set the token
    req.token = bearerToken
    // Next middleware
    next()
  }else{
    // forbidden
    res.status(403).json({
      message: "access forbidden due to incorrect or non-existent token"
    })
  }
}

app.listen(5000, () => {
  console.log('Server on port 5000')
})
