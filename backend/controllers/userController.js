const User = require('../models/userschema');
const Post = require('../models/postschema')
const Domain = require('../models/domainschema');
const generateToken = require('../utils/generateToken');

// GET
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ author: req.params.userId }).populate('subject', 'name').sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST
const registerUser = async (req, res) => {
  const {username,email,password,name,location,dateOfBirth,bio} = req.body;
  try {
    const emailHost = email.split('@')[1];
    const isWhitelisted = await Domain.findOne({ host: emailHost });

    if (!isWhitelisted) {
      return res.status(403).json({
        message: `Registration denied. ${emailHost} is not an authorized academic domain.`
      });
    }
    const userExists = await User.findOne({email});
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({username,email,password,name,bio:bio,location:location,dateOfBirth:dateOfBirth});
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        message: 'Registration successful!',
        role: user.role,
      });
    } else {res.status(400).json({ message: 'Invalid data received.' });}
  } catch (error) {
    res.status(500).json({message: 'Server error during registration.',details: error.message});
  }
};
const authUser = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email}).select('+password');
  const prevLogin = user.lastLogin;
  user.lastLogin = Date.now();
  await user.save();
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      subscriptions: user.subscriptions,
      role: user.role,
      lastSeen: prevLogin,
      warnings: user.warnings
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
const toggleSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subjectId = req.params.subjectId;
    if (user.subscriptions.includes(subjectId))
      user.subscriptions = user.subscriptions.filter(id=>id.toString()!==subjectId);
    else
      user.subscriptions.push(subjectId);
    await user.save();
    res.json(user.subscriptions);
  } catch (error) {res.status(500).json({ message: "Subscription update failed" });}
};
const reportUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    const alreadyReported = targetUser.reports.some(r =>
      r.reportedBy.toString() === req.user._id.toString() &&
      new Date(r.at).toDateString() === new Date().toDateString()
    );
    if (alreadyReported) return res.status(400).json({ message: "You already reported this user today" });
    targetUser.reports.push({reportedBy:req.user._id});
    await targetUser.save();

    res.json({ message: "User reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUserProfile, toggleSubscription, reportUser };