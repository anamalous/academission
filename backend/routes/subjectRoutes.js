const express = require('express');
const router = express.Router();
const { getAllSubjects, getSubjectById, createSubject, updateSubjectDescription } = require('../controllers/subjectController');
const { protect } = require('../middleware/authware');

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', protect, createSubject);
router.put('/:id/desc', protect, updateSubjectDescription);

module.exports = router;