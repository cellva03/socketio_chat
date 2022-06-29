const { Router } = require('express');
const authController = require('../controllers/adminController')
const router = Router();
const authentiactedRouter = require('express').Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
authentiactedRouter.get('/dash', authController.dash_get);

module.exports = {router,authentiactedRouter};