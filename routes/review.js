const express = require ("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, isReviewAuthor} = require ("../middleware.js");
const listingController = require("../controllers/reviews.js");

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
router.post("/", isLoggedIn, listingController.createReview);

//Delete review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, listingController.destroyReview);

module.exports = router;