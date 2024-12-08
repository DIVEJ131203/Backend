const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const userModel = require("./models/user");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/create", async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("Email already exists.");
        }

        const createdUser = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
        });
        res.redirect("/read");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user.");
    }
});

app.get("/read", async (req, res) => {
    try {
        const users = await userModel.find();
        res.render("read.ejs", { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users.");
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect("/read");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user.");
    }
});

app.get("/edit/:id", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id); // Fetch the user by ID
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.render("edit.ejs", { user }); // Pass the user object to the template
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user.");
    }
});
app.post("/update/:userid", async (req, res) => { // Corrected the route definition
    try {
        const { image, name, email } = req.body;
        // Find the user by ID and update
        const user = await userModel.findOneAndUpdate(
            { _id: req.params.userid },
            { image, name, email },
            { new: true }
        );
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.redirect("/read");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user.");
    }
});

app.listen(3000);
