const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const Review = require('./reviews'); 
const { type } = require("express/lib/response");


// const listingSchema = new Schema({
//     title: {
//         type:String,
//         required:true,
//     },
//     description: String,
//     image: {
//          filename: String,
//          url: {
//          type: String,
//         default: "https://unsplash.com/photos/brown-and-white-concrete-house-near-green-grass-field-during-daytime-aren8nutd1Q",
//         set: (v) => v === "" ? "https://unsplash.com/photos/brown-and-white-concrete-house-near-green-grass-field-during-daytime-aren8nutd1Q": v,
//   },
//     price: {
//         type: Number,
//     },
//     location:{
//         type:  String,
//     },
//     country: {
//         type: String,
//     },
// }
// });

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;