const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const path = require ("path");
const methodOverride = require ("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOption = {
    secret: "secretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.get("/", (req,res) =>{
    res.send("Hii");
});

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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




app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);


//Middleware for invalid route   --Not working
// app.all("*", (req,res,next) => {
//     next(new ExpressError(404, "Page not found!"));
// });

// app.use((err, req, res, next) =>{
//     let{statusCode=500, message="Something went Wrong!"} = err;
//     //res.status(statusCode).send(message);
//     res.status(statusCode).render("error.ejs",{message});
// })

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



//demo change