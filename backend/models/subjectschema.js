const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {type: String,required: true,unique: true,trim: true,},
    description: {type: String}, //add dialogue for subject creator to add description
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);