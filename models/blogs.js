const mongoose = require('mongoose');
const user = require('./user')
const { Schema } = mongoose;

//blog schema 
const blogSchema = new Schema({
    title: {
        type: String,
        maxLength: 140,
        required: true,
    },
    body: {
        type: String,
        maxLength: 1400,
        required: true,
    },
   photo:String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    updateAt: Date,
    auther: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    likes_count: Number,
    
    comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    tag: [String],

});


const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel; 