var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var authorize = require('../middleware/authenticate');
const Post = mongoose.model("Post");


// to view all posts

router.get('/newsfeed', authorize, (req,res) => {
    Post.find()
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .sort('-createdAt')
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({posts});
    })
    .catch((err) => {
        console.log(err);
    })
})

// to view all post created by user

router.get('/mypost', authorize, (req, res) => {
    Post.find({ author: req.user._id})
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .sort('-createdAt')
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({post});
    })
    .catch((err) => {
        console.log(err);
    })
})

// post of following users

router.get('/following', authorize, (req,res) => {
    
    Post.find({author: {$in: req.user.following}}) // if author in following
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .sort('-createdAt')
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({posts});
    })
    .catch((err) => {
        console.log(err);
    })
})

// post detail

router.get('/:postId', authorize, (req, res) => {
    Post.find({_id: req.params.postId})
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({post});
    })
    .catch((err) => {
        console.log(err);
    })
})

// for deleting a post

router.delete('/delete/:postId', authorize, (req, res) => {
    Post.findById(req.params.postId)
    .populate("author", "_id")
    .populate("comments.author", "_id username")
    .exec((err, post) => {
        if(err || !post) {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json")
            res.json({err: err})
            return
        }
        if(post.author._id.toString() === req.user._id.toString()) {
            post.remove()
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
})

// for creating a post

router.post('/create', authorize, (req, res) => {
    const { title, photo } = req.body
    console.log(title, photo);
    if (!title || !photo) {
        res.statusCode = 422;
        res.json({
            err: "Please add all the fields"
        })
        return;
    }
    req.user.password = undefined;
    req.user.email = undefined;
    const post = new Post({
        title,
        photo,
        author: req.user
    })
    post.save()
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Contene-Type', 'application/json');
        res.json({ post: result });
    })
    .catch((err) => {
        console.log(err);
    })
})

// for like

router.put('/like', authorize, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .exec((err, result) => {
        if(err) {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json")
            res.json({ err: err});
            return
        }
        else {
            res.json(result)
        }
    })
})

// for unlike

router.put('/unlike', authorize, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("author", "_id username photo")
    .populate("comments.author", "_id username")
    .exec((err, result) => {
        if(err) {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json")
            res.json({ err: err});
            return
        }
        else {
            res.json(result)
        }
    })
})

// for add comment

router.put('/comment', authorize, (req, res) => {
    const comment = {
        text: req.body.text,
        author: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment}
    }, {
        new: true
    })
    .populate("comments.author", "_id username")
    .populate("author", "_id username photo")
    .sort('-createdAt')
    .exec((err, result) => {
        if(err) {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json")
            res.json({ err: err});
            return
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router;