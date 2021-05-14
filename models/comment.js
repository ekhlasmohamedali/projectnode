const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentSchema = new Schema({
    content: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
})

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;