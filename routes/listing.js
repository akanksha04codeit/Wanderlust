const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner} = require ("../middleware.js");

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

//Index Route
router.get("/", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New Route                            
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new");          
});

//Create Route                 
router.post("/", async (req,res,next) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    // let result = listingSchema.validate(req.body);
    //  console.log(result);
    //  if(result.error){
    //     throw new ExpressError(400, result.error);
    //  }
        const newListing = new Listing (req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listing");
});

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing")
    }
    res.render("listings/edit",{listing});
});

//Update Route
router.put("/:id", isLoggedIn, isOwner, async (req,res) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`); 
});

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing")
});

//Show Route
router.get("/:id",async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing")
    }
    // console.log(listing);
    res.render("listings/show", { listing });
});

module.exports = router;