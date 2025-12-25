const Post = require('../models/postschema');
const Subject = require('../models/subjectschema');
const User = require('../models/userschema');
const Comment = require('../models/commentschema')

// GET
const getPosts = async (req, res) => {
  try {
    let query = {};
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    else if (req.user) {
      const user = await User.findById(req.user._id);
      if (user && Array.isArray(user.subscriptions) && user.subscriptions.length > 0)
        query = { subject: { $in: user.subscriptions } };
      else
        return res.json([]);
    }
    const posts = await Post.find(query).populate('author', 'username name').populate('subject', 'name').sort({ createdAt: -1 });
    for (let post of posts) { post.commentCount = await Comment.countDocuments({ post: post._id }); }
    res.json(posts);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username name')
      .populate('subject', 'name slug');
    if (post) { res.status(200).json(post); }
    else { res.status(404).json({ message: 'Post not found.' }); }
  } catch (error) {
    res.status(400).json({ message: 'Invalid Post ID format', details: error.message });
  }
};

// POST 
const createPost = async (req, res) => {
  const { title, content, subject } = req.body;
  const author = req.user._id;
  if (!title || !content || !subject) { return res.status(400).json({ message: 'Please include a title, content, and subject ID.' }); }
  try {
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) { return res.status(404).json({ message: 'Subject not found.' }); }

    const post = await Post.create({ title, content, subject, author });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) { res.status(500).json({ message: 'Failed to create post', details: error.message }); }
};

// UPDATE
const updatePost = async (req, res) => {
  const { title, content, subject } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { return res.status(404).json({ message: 'Post not found' }); }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this post. You are not the author.' });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.subject = subject || post.subject;
    const updatedPost = await post.save();
    res.status(200).json({message: 'Post updated successfully',post: updatedPost});
  } catch (error) { res.status(500).json({ message: 'Failed to update post', details: error.message }); }
};
const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (voteType === 'up') {
      if (hasUpvoted) post.upvotes.pull(userId);
      else {
        post.upvotes.addToSet(userId);
        post.downvotes.pull(userId);
      }
    } else if (voteType === 'down') {
      if (hasDownvoted) post.downvotes.pull(userId);
      else {
        post.downvotes.addToSet(userId);
        post.upvotes.pull(userId);
      }
    }
    post.voteScore = post.upvotes.length - post.downvotes.length;

    await post.save();
    res.json({voteScore: post.voteScore,upvotes: post.upvotes,downvotes: post.downvotes});
  } catch (error) {res.status(500).json({message: error.message});}
};

// DELETE
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { return res.status(404).json({ message: 'Post not found' }); }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post. You are not the author.' });
    }
    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete post', details: error.message }); }
};


module.exports = { createPost, getPosts, getPostById, updatePost, deletePost, votePost };