var jwt = require('jsonwebtoken');
var config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    // authorization === Bearer <token>
    if (!authorization) {
        res.statusCode = 401;
        res.json ({
            err: "You are not logged in"
        })
        return;
    }
    const token = authorization.replace("bearer ","")
    jwt.verify(token, config.secretKey, (err, payload) => {
        if(err) {
            console.log(err)
            res.statusCode = 401;
            res.json({
                err: "You are not logged in"
            })
            return;
        }

        const {_id} = payload
        User.findById(_id)
        .then((userData) => {
            req.user = userData
            next();
        })
    })
}