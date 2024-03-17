const mongoose = require('mongoose');
const Review = require('./review');
const { string } = require('joi');
const Schema = mongoose.Schema;

const defaultImgListing = "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: defaultImgListing
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }/* ,
    category:{
        type: String,
        enum : ['mountain', 'trending', 'room', 'camping', 'farm', 'uncategorised'],
        required: false,
        default: "uncategorised"
    } */
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    };
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
