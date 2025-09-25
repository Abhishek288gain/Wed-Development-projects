//initialize data 
const mongoose = require("mongoose");
const listing = require("../models/listing");
const initData = require("./data.js")

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(res => { console.log("connected to DB")}).catch((err) => { console.log(err)});
async function main() {
    await mongoose.connect(mongoURL);
}

const initDB = async () => {
    await listing.deleteMany({});//creating new obj with owner property
    initData.data = initData.data.map((obj) => ({...obj, owner: "68cc1c40ffca48c7c8e0033c"}));
    
    await listing.insertMany(initData.data);//initdata is obj but we want only key (data )
    console.log("data was initialize");
}
initDB();