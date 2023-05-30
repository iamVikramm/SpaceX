require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken")

app.use(express.json());

console.log("server is running on port 8080")

// Basic Posts to check Auth
const posts = [
    {
      type: 'Capsule',
      title: 'Vikrams Capsule'
    },
    {
        type: 'Capsule',
      title: 'Elons Capsule'
    }
  ]
  
  app.get('/spacexapi', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
  })

// Middleware before accessing
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    
    // Verifying JWT Token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

// Signing Access Token
app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username
    const user = { name: username }
    // Calling the generate function
    const accessToken = generateAccessToken(user)
    res.json({ accessToken: accessToken })
  })
  
// Generating token function
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"60s"})
  }

app.listen(8080)