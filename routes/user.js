const express = require ("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const listingController = require("../controllers/users.js");


router.get("/signup", listingController.renderSignupForm)

router.post("/signup", listingController.signup)

router.get("/login",listingController.renderLoginForm)

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),
    listingController.login)

router.get("/logout", listingController.logout);

module.exports = router;