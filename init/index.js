const mongoose = require("mongoose");
const initData = require("./data.js");


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

delete mongoose.connection.models['Listing'];

const Listing = require("../models/listing.js");
// const initDB = async ()=>{
//     await Listing.deleteMany({});
//     console.log(initData.data);
//     await Listing.insertMany(initData.data);
//     console.log("Initialized");
// }



 const initDB = async () => {
    // ✅ Drop the entire "listings" collection if it exists
    await mongoose.connection.dropCollection("listings").catch((err) => {
      console.log("ℹ️ No existing 'listings' collection. Skipping drop.");
    });

    // ✅ Insert new data
    console.log("🌱 Seeding data...");
    initData.data = initData.data.map((obj)=>({...obj, owner:"689339579d857a0e6002f339"}));
    const inserted = await Listing.insertMany(initData.data);
    console.log("✅ Inserted listings:", inserted);
  };


initDB().then(() => {
  mongoose.connection.close();
});