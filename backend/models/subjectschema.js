const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {type: String,required: true,unique: true,trim: true,},
    description: {type: String},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pinnedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    tags: {type: [String], default:[]},
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);