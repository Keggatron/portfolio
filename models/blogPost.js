var mongoose= require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", blogSchema);