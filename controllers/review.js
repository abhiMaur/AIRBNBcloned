const Listing = require("../models/listing");
const Review = require("../models/review");






module.exports.createReview = async(req,res)=>{
    try {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created!")
        res.redirect(`/listings/${listing._id}`)
    } catch (error) {
        console.error("Error adding review", error); 
        res.status(500).send("Error adding review");
    }
}


module.exports.deleteReview =  async (req,res)=>{
    let {id, reviewId} = req.params;
    try {
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!")
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review", error); 
        res.status(500).send("Error deleting review");
    }
}