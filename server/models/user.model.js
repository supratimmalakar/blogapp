const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : true,
        min: 6,
        max: 255
    },
    lname: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        select : false
    },
    date : {
        type : Date,
        default: Date.now()
    },
    bio: String,
    followers : [mongoose.SchemaTypes.ObjectId],
    following: [mongoose.SchemaTypes.ObjectId],
    posts: [mongoose.SchemaTypes.ObjectId]
})

module.exports = mongoose.model("User", userSchema);