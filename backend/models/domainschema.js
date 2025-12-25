const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  host: {type: String,required: true,unique: true,lowercase: true,trim: true}
}, { timestamps: true });

module.exports = mongoose.model('Domain', domainSchema);