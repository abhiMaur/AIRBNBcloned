const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


//passport-local-mongoose auatomatically define a useraname and password in schema
//also methods to evaluate them