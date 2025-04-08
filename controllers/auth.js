const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    // Check to see if user exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    // If yes, reject
    if (userInDatabase) {
        return res.status(401).send("Username already taken.");
    }

    // Check that password/confirm password match
    if (req.body.password !== req.body.confirmPassword) {
        // If no, reject
        return res.status(401).send("Password and Confirm Password must match");
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // validation logic
    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    // Check to see if user exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    // If no, reject
    if (!userInDatabase) {
        return res.status(401).send("Login failed, please try again.");
    } // status(401) is "unauthorized"

    // res.redirect("/sign-in")
    
    // Check that password hash matches
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );

    if (!validPassword) {
        // If no, reject
        return res.status(401).send("Login failed, please try again.");
    }

    // Allow login, start session
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };

    res.redirect("/") 
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = router;