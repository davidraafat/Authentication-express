var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStratgy          = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"), 
    User                  = require("./Models/user"),
    app                   = express();


// App Config
app.use(require("express-session")({
    secret:"David is the best hacker",
    resave: false,
    saveUninitialized: false
}));
mongoose.connect("mongodb://localhost:27017/auth_demo_app", {useNewUrlParser:true, useUnifiedTopology:true});
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStratgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App routes
app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/secret",isLoggedIn,(req,res)=>{
    res.render("secret");
});
// App auth routes
// Register
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    User.register(new User({username:req.body.username}), req.body.password , (err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
             res.redirect("/secret");
        });
    });
});
// Login
app.get("/login",(req,res)=>{
    res.render("login")
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),(req,res)=>{
    res.render("login")
});
//logout 
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

// Is logged in middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,()=>{
    console.log("App lestin at port 3000");
})