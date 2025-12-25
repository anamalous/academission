const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authware');

router.get('/:postId', getCommentsByPost);
router.post('/', protect, addComment);
router.delete('/:commentId',protect,deleteComment)

module.exports = router;