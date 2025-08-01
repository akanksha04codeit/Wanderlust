const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing");
const path = require ("path");
const methodOverride = require ("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/reviews");


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
    console.log("DB is connected");
})
.catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req,res) =>{
    res.send("Hii");
});

const validateListing = (req, res, next) => {
    let{ error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

const validateReview = (req, res, next) => {
    let{ error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index Route
app.get("/listing", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route                            
app.get("/listing/new", (req, res) => {
    res.render("listings/new");          
});

//Create Route                 
app.post("/listing", validateListing, wrapAsync(async (req,res,next) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let result = listingSchema.validate(req.body);
     console.log(result);
     if(result.error){
        throw new ExpressError(400, result.error);
     }
        const newListing = new Listing (req.body.listing);
        await newListing.save();
        res.redirect("/listing");
}));

//Edit Route
app.get("/listing/:id/edit", wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

//Update Route
app.put("/listing/:id", validateListing, wrapAsync(async (req,res) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`); 
}));

//Delete Route
app.delete("/listing/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listing")
}));

//Show Route
app.get("/listing/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    // console.log(listing);
    res.render("listings/show", { listing });
}));

//Review
//Post Route
app.post("/listing/:id/reviews", wrapAsync(async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}));


//Middleware for invalid route   --Not working
// app.all("*", (req,res,next) => {
//     next(new ExpressError(404, "Page not found!"));
// });

app.use((err, req, res, next) =>{
    let{statusCode=500, message="Something went Wrong!"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080, () =>{
    console.log(`app is listening on port 8080`);
});

app.get("/testListing", async (req,res) => {
    let sampleListing = new Listing({
        title: "My new villa",
        description: "By the beach",
        price: 14000,
        location: "Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful");
});



