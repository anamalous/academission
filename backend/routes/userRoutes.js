const express = require('express');
const router = express.Router();
const { registerUser, authUser, toggleSubscription, getUserProfile, reportUser } = require('../controllers/userController'); 
const { protect } = require('../middleware/authware');

router.get('/profile/:userId', getUserProfile);
router.post('/register', registerUser);
router.post('/login', authUser); 
router.post('/subscribe/:subjectId', protect, toggleSubscription);
router.post('/report/:id',protect,reportUser);

module.exports = router;