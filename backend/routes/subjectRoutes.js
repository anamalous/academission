const express = require('express');
const router = express.Router();
const { getAllSubjects, getSubjectById, createSubject, updateSubjectTags, summariseDay } = require('../controllers/subjectController');
const { protect } = require('../middleware/authware');
const Post = require('../models/postschema');

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', protect, createSubject);
router.patch('/:id/tags', protect, updateSubjectTags);
router.get('/:id/summary', protect, summariseDay);

module.exports = router;