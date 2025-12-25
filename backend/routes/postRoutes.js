const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authware'); 
const { createPost, getPosts, getPostById, updatePost, deletePost, votePost } = require('../controllers/postController');

router.get('/', protect, getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id/vote', protect, votePost);
router.route('/:id')
    .put(protect, updatePost)    
    .delete(protect, deletePost); 

module.exports = router;