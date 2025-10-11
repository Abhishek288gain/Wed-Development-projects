const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleWare.js");
const listingController = require("../controllers/listings.js");
const mulper = require("multer");//it is used for parsing uploaded data(file) for backend
const {storage} = require("../cloudConfig.js");
const upload = mulper({storage});//destination is cloudinaryStorage where our files are uploaded

//router.route() is used to accept diffrent type of req at same path
router.route("/")
.get( wrapAsync(listingController.index))
.post( upload.single("listing[image][url]"), validateListing, wrapAsync( listingController.addNewListings));//Add new listings in DB


//new listing create
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync( listingController.renderEditForm));

router.route("/:id")
.get(wrapAsync( listingController.showListings ))//show listings in detail
.put( isLoggedIn, isOwner, 
    upload.single("listing[image][url]"), 
    validateListing, 
    listingController.editListings)//add updation in original listing
.delete( isLoggedIn, isOwner, wrapAsync( listingController.destroyListings));

module.exports = router;