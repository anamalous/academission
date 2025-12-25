const Comment = require('../models/commentschema');

//GET
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username name')
      .sort({createdAt: -1});
    res.json(comments);
  } catch (error) {
    console.error("Fetch Comments Error:", error);
    res.status(500).json({ message: "Could not fetch comments" });
  }
};

//POST
const addComment = async (req, res) => {
  try {
    const {content, postId} = req.body;
    if (!content) {return res.status(400).json({message:'Comment content is required'});}

    const comment = await Comment.create({content,post: postId,author: req.user._id});
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) { return res.status(404).json({ message: 'Comment not found' }); }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this comment. You are not the author.' });
    }
    await Comment.deleteOne({ _id: comment._id });
    res.status(200).json({ message: 'Comment removed successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete comment', details: error.message }); }
};



module.exports = {addComment, getCommentsByPost, deleteComment};