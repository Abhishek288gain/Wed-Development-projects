const express = require("express");
const router = express.Router({mergeParams: true});//we set mergeParams to true. so that /:id route can also combin with child routes
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressErr = require("../utils/ExpressErr.js");
// const {reviewSchema} = require("../schema.js");
// const Review = require("../models/reviews.js");
// const listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleWare.js");

const reviewController = require("../controllers/reviews.js");

//create reviews post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));

//delete reviews from specific listings
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReviews));

module.exports = router;
