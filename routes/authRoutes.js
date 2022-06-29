const { Router } = require('express');
// const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const authentiactedRouter = require('express').Router();
const router = Router();
// router.get('*', checkUser);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
authentiactedRouter.get('/dash', authController.dash_get);

module.exports = {router,authentiactedRouter};