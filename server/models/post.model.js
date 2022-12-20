const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: [mongoose.SchemaTypes.ObjectId]
})

module.exports = mongoose.model("Post", postSchema);