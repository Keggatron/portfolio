var Blog = require("../models/blogPost");
var User = require("../models/user");


var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = middlewareObj;