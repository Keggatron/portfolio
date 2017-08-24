var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    middleware      = require("./middleware"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    Blog            = require("./models/blogPost");
    
    
var url = process.env.DATABASEURL || "mongodb://localhost/portfolio";
mongoose.connect(url, {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Once again Rusty wins!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



app.get("/", function(req,res){
    res.render("landing");
});

app.get("/portfolio", function(req, res){
    res.render("portfolio");
});

app.get("/blog", function(req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("blog", {blogs:blogs});
        }
    });
});



// Create route
app.post("/blog", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.redirect("blog");
        } else {
            res.render("blog/show", {blogs: newBlog})
        }
    })
})

// SHOW page
app.get("/blog/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("blog/show", {blogs: foundPost});
        }
    });
});

// Edit Route
app.get("/blog/:id/edit", middleware.isLoggedIn, function(req,res){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blog");
            } else {
                res.render("blog/edit", {blogs:foundBlog})
            }
        });
    } else {
        res.redirect("/");
    }
});

// Update Route
app.put("/blog/:id", middleware.isLoggedIn, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

// Delete route
app.delete("/blog/:id", middleware.isLoggedIn, function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blog");
        }else {
            res.redirect("/blog");
        }
    });
});

// // Auth routes
// app.get("/register", function(req,res){
//     res.render("register");
// });

// app.post("/register", function(req,res){
//     User.register(new User({username: req.body.username}), req.body.password, function(err,user){
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }            
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/secret");
//         });
//     });
// });

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirec:"/"
}),function(res,req){
}); 

app.get("/logout",  function(req, res){
    req.logout();
    res.redirect("/");
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Blog server has started");
});
