var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var authorize = require('../middleware/authenticate');
const User = mongoose.model("User");
const Post = mongoose.model("Post");

// for other people profile

router.get('/:id', authorize, (req, res) => {
    User.findById({_id: req.params.id})
    .select("-password")
    .then((user) => {
      Post.find({author: req.params.id})
      .populate("author", "_id username")
      .exec((err, posts) => {
        if(err) {
          res.statusCode = 422;
          res.json({ err: err})
        }
        res.json({user, posts})
      })
    })
    .catch((err) => {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: "User not found"})
    })
  })


// for follow users


router.put('/follow', authorize, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: {followers: req.user._id}
  }, {
    new: true
  }, (err, result) => {
    if(err) {
      res.statusCode = 422;
      res.json({err: err})
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: {following: req.body.followId}
    }, {
      new: true
    })
    .select("-password")
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.statusCode = 422;
      res.json({err: err})
    })
  })
})

// for unfolllow users

router.put('/unfollow', authorize, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: {followers: req.user._id}
  }, {
    new: true
  }, (err, result) => {
    if(err) {
      res.statusCode = 422;
      res.json({err: err})
    }
    User.findByIdAndUpdate(req.user._id, {
      $pull: {following: req.body.unfollowId}
    }, {
      new: true
    })
    .select("-password")
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.statusCode = 422;
      res.json({err: err})
    })
  })
})

// updating profile pic

router.put('/updatePhoto', authorize, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {$set: {photo: req.body.photo}}, {new: true}, (err, result) => {
    if(err) {
      res.statusCode = 422;
      res.json({err: "Cannot Post"})
    }
    res.json(result)
  })

})

// searching users


router.post('/search', (req,res) => {
  let re = new RegExp("^" + req.body.query)

  User.find({username: {$regex: re}})
  .select("_id username photo")
  .then((user) => {
    res.json({user})
  })
  .catch((err) => {
    console.log(err);
  })
})
  
  module.exports = router;