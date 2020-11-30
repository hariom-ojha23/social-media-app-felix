var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var crypto = require('crypto');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const authorize = require('../middleware/authenticate');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// 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


const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}));

// for Signup

router.post('/signup', (req, res) => {
  const { username, email, password, photo } = req.body
  if( !email || !username || !password ) {
    return res.status(422).json({err: " Please fill all the fields"});
  }
  User.findOne({ username: username }) //searching for user with provided username
  .then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({err: " User exist with this username"});
    }
    bcrypt.hash(password, 12)  //hashing password
    .then((hashedPassword) => {
      const user = new User({
        username,
        email,
        password: hashedPassword,
        photo: photo
      })
  
      user.save()
      .then((user) => {
        transporter.sendMail({
          to: user.email,
          from: "no-reply@felix23.ml",
          subject: "signup success",
          html: "<h2>welcome to felix</h2>"
        })
        res.json({ message: "Successfully Signed up"})
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err);
  })
});


// for Signin


router.post('/login', (req, res) => {
  const { username, password } = req.body
  if ( !username || !password) {
    return res.status(422).json({err: " Please provide all details"});
  }
  User.findOne({ username: username})
  .then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({err: " Invalid Username or Password"});
    }
    bcrypt.compare(password, savedUser.password) // checking hashed password
    .then((match) => {
      if(match) {
        const token = jwt.sign({_id: savedUser._id}, config.secretKey); // jwt token
        const {_id, username, email, followers, following, photo } = savedUser;
        res.json({ token, user: {_id, username, email, followers,following, photo} })
        
      }
      else {
        return res.status(422).json({err: " Invalid Username or password"});
      }
    })
    .catch((err) => {
      console.log(err);
    })
  })
})

// for Forgot password

router.post('/password-reset', (req, res) => {
  console.log(req.body.email)
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
    }
    console.log(buffer)
    const token = buffer.toString("hex")
    User.findOne({email: req.body.email})
    .then((user) => {
      if(!user) {
        res.statusCode = 404;
        res.json({error: "User don't exist with that email"})
        return
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save()
      .then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "no-reply@felix23.ml",
          subject: "password-reset",
          html: `
          <p>You requested for password reset</p>
          <h5>Click this <a href="http://localhost:3000/resetPassword/${token}">link</a> to reset your password</h5>
          `
        })
        res.json({message: "check your email"})
      })
    })
  });
});

// password reset


router.post('/newPassword', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token

  User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
  .then((user) => {
    if(!user) {
      res.statusCode = 422;
      res.json({error: "Try Again session expire"});
    }
    bcrypt.hash(newPassword, 12)
    .then((hashedPassword) => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save()
      .then((savedUser) => {
        res.json({message: "Password reset successfully !!"})
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err);
    })
  })
});


// follower list

router.get('/follower-list', authorize, (req,res) => {
  User.find({_id: req.user.followers})
  .then((user) => {
    res.statusCode = 200;
    res.json(user)
  })
  .catch((err) => {
    res.statusCode = 422;
    console.log(err);
  })
})

module.exports = router;