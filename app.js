if(process.env.NODE_ENV != "production"){//Now we access env Credential in development phase not in production phase
    require("dotenv").config();//dotenv for loading(access) env Credential in app.js
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const cloudDBurl = process.env.ATLASDB_URL;//use new DB in cloud using mongo atlas

main()
.then(() => { console.log("connected to DB")}).catch((err) => { console.log(err)});
async function main() {
    await mongoose.connect(cloudDBurl);
}

const storeSessionInfo = MongoStore.create({//we will store session related info like cookie, user expiry on mongo session 
    mongoUrl: cloudDBurl, //store sesssion info in mongo atlas DB
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, //store user info(login) in session for 24 hour in sec. 
});

storeSessionInfo.on("error", () => {
    console.log("ERROR in mongo session storeSessionInfo", err);
});

const sessionOption = {
    store: storeSessionInfo,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {//exprire set the expire date cookie
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//there are 7 * 24 * 60 * 60 * 1000 mili sec in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//for initailizing the passport
app.use(passport.session());//for traking the user during req and res sending by user. it is a same user
passport.use(new LocalStrategy(User.authenticate()));//use static authenticate methodof model in  localStrategy

passport.serializeUser(User.serializeUser());//for storing login info of user in session as a cookies
passport.deserializeUser(User.deserializeUser());//for unstoring info of user when user leave the session 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");//use req.local for access var in all templates
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//string info of curr working user
    // console.log(res.locals.success);
    next();
});

const listingsRoute = require("./router/listingsRoute.js");//restructuring Listing using express router obj
const reviewsRoute = require("./router/reviewsRoute.js");//restructuring review using express router obj
const usersRoute = require("./router/usersRoute.js");
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);//its usage like includes & partail method


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

// app.get("/listing", async (req, res) => {
//     let sampleData = new listing({
//         tilte: "Narayan Hotel",
//         description: "We have amazing interier for custumers",
//         price: 1000,
//         location: "Gwalior",
//         country: "India"
//     });
//     await sampleData.save();
//     console.log("Save success");
//     res.send("success");
// });
// app.get("/", (req, res) => {
//     res.send("hi , i am route");
// });


app.use("/listings", listingsRoute);//this syntex match the route of listings(child route) with /listings execute all route which is start from /listings(parent route) 
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", usersRoute);

// app.all("*", (req, res, next) => {
//     next(new ExpressErr(404, "Page not found"));// 400 mena bad req send by user
// });

// app.use((err, req, res, next) => {
//     let {statusCode=500, msg="Some Error occured"} = err;
//     res.status(statusCode).render("error.ejs", {msg});
// });

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

// const handleMongooseErr = (err) => {
//     console.dir(err.message);
//     return err;
// }

// app.use((err, req, res, next) => {
//     console.log(err.name);
//     if(err.name == "ValidationError"){
//         handleMongooseErr(err);
//     }
//     next(err);
// });
