const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

var Post = new Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: String,
            author: {
                type: ObjectId,
                ref: "User"
            }
        }
    ],
    author: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", Post);