const express = require ("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, isReviewAuthor} = require ("../middleware.js");

// const validateReview = (req, res, next) => {
//     // let{ error } = reviewSchema.validate(req.body);
//     let error = listingSchema.validate({ listing: req.body });

//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

//Review
//Post review Route
router.post("/", isLoggedIn, async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listing/${listing._id}`);
});

//Delete review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async(req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`);
})

module.exports = router;