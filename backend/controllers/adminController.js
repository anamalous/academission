const Domain = require('../models/domainschema');
const User = require('../models/userschema');
const Post = require('../models/postschema');
const Comment = require('../models/commentschema');

// GET
const getWhitelistedDomains = async (req, res) => {
  try {
    const domains = await Domain.find().select('-addedBy');
    res.json(domains);
  } catch (error) {res.status(500).json({ message: error.message });}
};
const getNewPostsSinceLogin = async (req, res) => {
  try {
    const {since} = req.query; 
    const posts = await Post.find({createdAt: {$gt: new Date(since)}})
    .populate('author', 'username').populate('subject', 'name').sort({createdAt: -1});

    res.json(posts);
  } catch (error) {res.status(500).json({ message: error.message });}
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const today = new Date().toDateString();
    await User.updateMany({},{$pull:{reports:{at:{$lt: today}}}});

    const usersWithFlags = users.map(u => {
      const todayReports = u.reports ? u.reports.filter(r => 
        new Date(r.at).toDateString() === today
      ).length : 0;

      return {...u._doc,reportCount: todayReports};
    });

    res.json(usersWithFlags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST
const addWhitelistedDomain = async (req, res) => {
  try {
    const {host} = req.body;
    const existing = await Domain.findOne({ host });
    if (existing) return res.status(400).json({message:"Domain already whitelisted"});

    const domain = await Domain.create({ host, addedBy: req.user._id });
    res.status(201).json(domain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const warnUser = async (req, res) => {
  const {userId,message,adminReason} = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,{$push:{warnings:{message,adminReason}}},{new:true});
    res.json({ message: "Warning sent", warnings: user.warnings });
  } catch (error) {
    res.status(500).json({ message: "Error sending warning" });
  }
};

// DELETE
const deleteWhitelistedDomain = async (req, res) => {
  try {
    await Domain.findByIdAndDelete(req.params.id);
    res.json({ message: "Domain removed from whitelist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Post.deleteMany({author:req.params.id});
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User and their content removed permanently" });
  } catch (error) {res.status(500).json({ message: error.message });}
};
const adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.json({ message: "Post removed by administrator" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminDeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    await comment.deleteOne();
    res.json({ message: "Comment removed by administrator" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={getWhitelistedDomains, getNewPostsSinceLogin, getAllUsers, addWhitelistedDomain, warnUser, deleteWhitelistedDomain, deleteUser, adminDeleteComment, adminDeletePost}



