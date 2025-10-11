const mongoose = require("mongoose");
const reviews = require("./reviews");
let Schema = mongoose.Schema;
const Review = require("./reviews.js");

let listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
             //for setting default link in any post. this is for backend ( for us)        
            default: "http://eduspiral.files.wordpress.com/2011/11/hotels.jpg",
            // if upcomming img is empty. this parameter for clinte side
            set: (v) => v === "" ? 
            "http://eduspiral.files.wordpress.com/2011/11/hotels.jpg" : v
        },              
    },
    price: {
        type: Number
    },
    location: {
        type: String
    }, 
    country: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ], 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:  {
        type: {
            type: String, // Don't do `{ geometry: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        }
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountain", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"]
    }
});

listingSchema.post("findOneAndDelete", async(listings) => { // this middwre call for all deleting listings
    if(listings){//delete all reviews. which is Associated with deleted listing 
        console.log(listings.reviews);
        await Review.deleteMany({_id: {$in: listings.reviews}});
    }  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;