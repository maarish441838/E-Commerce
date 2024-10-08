const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const seedDB = require("./seed");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const productApi = require("./routes/api/productapi"); //api
const passport = require("passport"); //pass
const LocalStrategy = require("passport-local"); //pass
const User = require("./models/User"); //pass
// const MongoStore = require('connect-mongo');



mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://maarish441:Aarish%4012@cluster0.amy8i.mongodb.net/Shopify?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// now for public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// seeding dummy data
// seedDB();
// let store = MongoStore.create({
//   secret:"keyboard cat",
//   mongoUrl: "mongodb+srv://maarish441:4iVJmgI4lKtgoiIw@cluster0.upgjo.mongodb.net/shop" ,
//   touchAfter:24*60*60
// })

let configSession = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(configSession));
app.use(flash());

// use static serialize and deserialize of model for passport session support
app.use(passport.initialize()); //pass
app.use(passport.session()); //pass
passport.serializeUser(User.serializeUser()); //pass
passport.deserializeUser(User.deserializeUser()); //pass

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate())); //pass

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// Routes
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productApi);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server connected at port : ${PORT}`);
});
