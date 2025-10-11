const { assert } = require("joi");
const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//geocoding for map location
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});//start geocoding services
function normalizeString(str) {
    return str
        .trim()              // remove leading/trailing spaces
        .toLowerCase()       // make case-insensitive
        .replace(/\s+/g, " ") // collapse multiple spaces
        .normalize("NFD")     // normalize accents
        .replace(/[\u0300-\u036f]/g, ""); // strip accents
}

module.exports.index = async (req, res) => {
    let {category, country} = req.query;
    let filter = {};
    
    if(category && category !== "All") {
        filter.category = category;
    }
    // console.log(allListings);
    let allListings = await listing.find(filter);
    if(country){
        const normalized = normalizeString(country); //for convert country name into original country name if user wrong country     
        filter.country = { 
            $regex: new RegExp(normalized, "i") 
        };
        allListings = await listing.find(filter);
    }
    res.render("listings/index.ejs", { allListings, SelectionCategory: category || "All",});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async(req, res) => {
    let {id} = req.params;
    const listings = await listing.findById(id)
    .populate({path: "reviews", 
        populate: { path: "author"}//populate review with thier created auther
    })                                     
    .populate("owner");//populate help for add reviews and owner in listings with all details
    // if(!listings){
    //     throw next(new ExpressError(404, "Listings not found."))
    // }
    if(!listings){
        req.flash("error", "listings you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listings});
};

module.exports.addNewListings = async (req, res, next) => {  
    let response = await geocodingClient.forwardGeocode({//response is mapbox obj
        // query: 'New Delhi, India',
        query: req.body.listing.location, //location which enter by user during create new listings
        limit: 1                //we get only 1 possible coordinate for req.body.listings.location
        
    }).send();

    // console.log(req.file);
    let url = req.file.path;
    let filename = req.file.filename;
 
    // let {title, description, image, price, country, location} = req.body; //this is one method for extract info from post req
    const newListings = new listing(req.body.listing);  //here listing in req.body.listing is a obj which contain all info of new listing.
    // console.log(newListings);
    newListings.owner = req.user._id;//add also owner id in listing
    // we already create listing obj in form
    // let newListings = new listing({ title, description, image, price, country, location});
    newListings.image = {url, filename};
    newListings.geometry = response.body.features[0].geometry;//coordinate comes from mapbox

    let saveListing = await newListings.save();
  
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listings = await listing.findById(id);
    // console.log(listings);
    if(!listings){
        req.flash("error", "listings you requested for updation  does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listings.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");//change the pixel when we show original image
    // console.log(listings.image.url);
    res.render("listings/edit.ejs", {listings, originalImageUrl});
};

module.exports.editListings = async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressErr(400, "send valid data for listings");
    // }
    let {id} = req.params;
    // console.log(req.body.listing.image);
    const updatedListing = await listing.findByIdAndUpdate(id, 
        {...req.body.listing}, { new: true, runValidators: true }
    );//first we find by id and deconstruct the listing obj. so that individual key: pair is seperate

    if(typeof req.file !== "undefined"){//if user not upload new image then req.file become undefine therefor we check this condition
        let url = req.file.path;
        let filename = req.file.filename
        updatedListing.image = {url, filename};
        await updatedListing.save(); 
    }
    // console.log(updatedListing);
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
    // console.log(req.user);
    let {id} = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);//findByIdAndDelete() is all then as a middleware they all reviews associated with listing
    // console.log(deletedListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
};