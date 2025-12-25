const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,required: [true, 'Title is required'],trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']},
    content: {
        type: String,required: [true, 'Content is required'],
        maxlength: [5000, 'Post content cannot exceed 5000 characters']},
    author: {type: mongoose.Schema.Types.ObjectId,required: true,ref: 'User'},
    subject: { type: mongoose.Schema.Types.ObjectId,required: true,ref: 'Subject'},
    upvotes: [{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
    downvotes: [{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
    voteScore: {type: Number,default: 0},
    commentsCount: {type: Number,default: 0,}
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);