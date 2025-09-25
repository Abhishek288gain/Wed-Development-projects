const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    // username, password, hashing, solt AND Authentication field will be set by passportLocalMongoose
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);