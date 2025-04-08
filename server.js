// Requirements
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // For using HTTP verbs such as PUT or DELETE
app.use(morgan('dev')); // For logging HTTP requests
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// Controllers
const authController = require("./controllers/auth.js");
app.use("/auth", authController);

// The code above is the shortform version of the code below. It reads exactly the same to the computer.
// let port;
// if (process.env.PORT) {
//   port = process.env.PORT;
// } else {
//   port = 3000;
// };

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Routes
app.get("/", async (req, res) => {
    res.render("index.ejs", {
        user: req.session.user,
    });
});

app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});