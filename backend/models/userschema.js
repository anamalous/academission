const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,required: [true, 'Email is required'],
        unique: true, trim: true,lowercase: true,},
    password: {type: String,required: [true, 'Password is required'],select: false},
    username: {
        type: String,required: [true, 'Username is required'],unique: true,
        trim: true,minlength: [3, 'Username must be at least 3 characters long']},
    name: {type: String,trim: true,},
    bio: {type: String,maxlength: [500, 'Bio cannot be more than 500 characters']},
    dateOfBirth: {type: Date},
    location: {type: String,trim: true,},
    subscriptions: [{type: mongoose.Schema.Types.ObjectId,ref: 'Subject'}],
    role: {type: String,enum: ['user', 'admin'],default: 'user'},
    warnings: [{message: String,adminReason: String,date: {type: Date,default: Date.now}}],
    reports: [{
        reportedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        at: {type: Date, default: Date.now}
    }],
    lastLogin: {type: Date,default: Date.now}
}, {timestamps: true});
UserSchema.pre('save', async function () {
    if (!this.isModified('password'))return;
    return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {this.password = hash;});
    });

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);