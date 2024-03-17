const Listing = require("../models/listing");
const review = require("../models/review");
const Review = require("../models/review");
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in")
        return res.redirect('/login')
       }
    else{
        next();
    }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error", " You don't have permission to edit");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.validateListing = (req, res, next)=>{
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => Array.isArray(el.message) ? el.message.join(", ") : el.message);
        throw new ExpressError(400, errMsg);
    } else {
        next(error);
    }
}

module.exports.validateReview=(req, res, next)=>{
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => Array.isArray(el.message) ? el.message.join(", ") : el.message);
        throw new ExpressError(400, errMsg);
    } else {
        next(error);
    }

}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }

    next()
}