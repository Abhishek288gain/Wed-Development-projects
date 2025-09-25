const joi = require("joi");
const Listings = require("./models/listing");
//this is a schema for server side validaton 
module.exports.listingSchema = joi.object({
    //whenever we get req listing obj should present at all
    listing: joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        country : joi.string().required(),
        location : joi.string().required(),
        price : joi.number().required().min(0),
        image: {
           url: joi.string().allow("", null),
        }
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});