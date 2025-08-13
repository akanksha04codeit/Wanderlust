const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner} = require ("../middleware.js");
const listingController = require("../controllers/listings.js");

// const validateListing = (req, res, next) => {
//     // let{ error } = listingSchema.validate(req.body);
//     let error = listingSchema.validate({ listing: req.body });

//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    // let result = listingSchema.validate(req.body);
    //  console.log(result);
    //  if(result.error){
    //     throw new ExpressError(400, result.error);
    //  }

    router.route("/")
        .get(listingController.index)              //Index Route
        .post(listingController.createListing)    //Create Route 
//Index Route
// router.get("/",listingController.index);

//New Route                            
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Create Route                 
// router.post("/", listingController.createListing);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

router.route("/:id")
    .put(isLoggedIn, isOwner, listingController.updateListing)  //Update Route
    .delete(isLoggedIn, isOwner, listingController.destroyListing)  //Delete Route
    .get(listingController.showListing)  //Show Route

//Update Route
// router.put("/:id", isLoggedIn, isOwner, listingController.updateListing);

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

//Show Route
// router.get("/:id", listingController.showListing);

module.exports = router;