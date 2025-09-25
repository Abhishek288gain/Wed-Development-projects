const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signUp.ejs");
};

module.exports.signUp = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser =  new User({username, email});
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err){
               return next(err);
            }
            req.flash('success', "Welcome to wanderlust");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logIn = async(req, res) => {
    req.flash("success", "welcome back to Wanderlust!");
    let rediectUrl = res.locals.redirectUrl || "/listings";//IF user is not login then previous path (req.locals.redirectUrl) is exist
    res.redirect(rediectUrl);
}

module.exports.logOut = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash('success', "You are Logged out");
        res.redirect("/listings");
    });
};