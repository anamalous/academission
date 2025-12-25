const express = require('express');
const router = express.Router();
const { getWhitelistedDomains, addWhitelistedDomain, deleteWhitelistedDomain, deleteUser, adminDeleteComment, adminDeletePost, getNewPostsSinceLogin, getAllUsers, warnUser } = require('../controllers/adminController');
const { protect,admin } = require('../middleware/authware');

router.use(protect);
router.use(admin);

router.route('/domains').get(getWhitelistedDomains).post(addWhitelistedDomain);
router.delete('/domains/:id', deleteWhitelistedDomain);

// User Management Route
router.get('/users', getAllUsers);
router.get('/recent-activity', getNewPostsSinceLogin);
router.post('/warn',warnUser);
router.delete('/users/:id', deleteUser);
router.delete('/posts/:id', adminDeletePost);
router.delete('/comments/:commentId', adminDeleteComment);

module.exports = router;