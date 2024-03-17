const express = require('express');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport')
const User = require('../models/user');
const { saveRedirectUrl } = require('../middleware/middleware');
const userController = require('../controllers/user');
const router = express.Router();



router.route("/signup")
.get(userController.renderSignupForm)
.post( userController.userSignup)



router.route("/login")
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {faliureRedirect: "/login",
    faliureFlash: true}),  
    userController.userLogin )

router.get("/logout", userController.userLogout)

module.exports = router;