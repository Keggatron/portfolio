var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser");
    

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");



app.get("/", function(req,res){
    res.render("landing");
});

app.get("/portfolio", function(req, res){
    res.render("portfolio");
});

app.get("/blog", function(req, res) {
    res.render("blog");
});

app.get("/blog/new", function(req, res){
    res.render("blog/new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Blog server has started");
});
