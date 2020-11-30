var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: Date
    },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/harry23/image/upload/v1605536288/default-profile-picture1_htrxx3.jpg"
    },
    followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "User"
        }        
    ]
});

module.exports = mongoose.model("User", User);
