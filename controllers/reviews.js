const Review = require("../models/reviews");
const listing = require("../models/listing");

module.exports.createReviews = async(req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);//review is obj create in show.ejs for review data
    newReview.author = req.user._id;//assigning auther during creation of new Reviews

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "New review Created!");
    res.redirect(`/listings/${listings.id}`);
};

module.exports.destroyReviews = async(req, res, next) => {
    let {id, reviewId} = req.params;
    //deleting reviews from review Arr which is present in  listing Schema
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted!");
    res.redirect(`/listings/${id}`);
};