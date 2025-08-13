const express = require ("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const listingController = require("../controllers/users.js");

router.route("/signup")
    .get(listingController.renderSignupForm)
    .post(listingController.signup);

// router.get("/signup", listingController.renderSignupForm)

// router.post("/signup", listingController.signup)

router.route("/login")
    .get(listingController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),
    listingController.login)

// router.get("/login",listingController.renderLoginForm)

// router.post("/login", saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),
//     listingController.login)

router.get("/logout", listingController.logout);

module.exports = router;