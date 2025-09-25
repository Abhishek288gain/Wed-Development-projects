const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleWare.js");
const {isLoggedIn} = require("../middleWare.js");
const userController = require("../controllers/users.js");

router.route("/signUp")
.get( userController.renderSignupForm)
.post( wrapAsync( userController.signUp));

router.route("/login")
.get( userController.renderLoginform)
//passpost provide an authenticate() func which is used as route middleware to authenticate request
.post( saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true 
    }), 
    userController.logIn
);

//logged out route
router.get("/logout", userController.logOut);

module.exports = router;