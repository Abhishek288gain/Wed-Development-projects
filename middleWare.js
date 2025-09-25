const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressErr = require("./utils/ExpressErr.js");
const {listingSchema, reviewSchema} = require("./schema.js");

//create this middleware for protecting backend
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        //we are save req.originalUrl into req.session.redirectUrl when user is not loggedIn  
        req.session.redirectUrl = req.originalUrl;//here we create rediectUrl var in req.session for redirecting  to previous path after login on website
        req.flash("error", "you must logedIn on Wanderlust");
        return res.redirect("/login");
    } 
    next();
};
//we use this func because when login from /listings isloggedIn middlewsre is not trigger
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    // console.log(req.session.redirectUrl);
    next();
};
// check autherization for edit and delete currUser is also present in res.locals and then check thier ids
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listings = await Listing.findById(id);
//if curr user who running website is not onwer of listing then we flash this msg
    if (!listings.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not a owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    //with the help of listingSchema we are check all field are enter by user or not 
    let {error} = listingSchema.validate(req.body);//extract error from result
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");//extract msg of individual error detail
        throw new ExpressErr(400, errorMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    //with the help of listingReview we are check all field are enter by user or not 
    let {error} = reviewSchema.validate(req.body);//extract error from result
    // console.log(error);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");//extract msg of individual error detail
        throw new ExpressErr(400, errorMsg);
    }else {
        next();
    }
}
//create middlewrre for delete review by thier author
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    // console.log(reviewId);
    let reviews = await Review.findById(reviewId);
//if curr user who running website is not auther of reviews then we flash this msg
    if (!reviews.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not a Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};2