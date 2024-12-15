const express = require("express");
const app = express();
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postModel=require("./models/post");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All fields are required");
    }
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid email or password");
    let token = jwt.sign({ email: user.email, userid: user._id }, "SecretKey");
    res.cookie("token", token);
    res.redirect("/profile");
});

app.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate("posts");
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("profile.ejs", { user }); 
    } catch (error) {
        res.status(500).send("Server error");
    }
});
app.get("/edit/:id", isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Ensure only the post owner can edit
        if (!post.user.equals(req.user.userid)) {
            return res.status(403).send("Unauthorized to edit this post");
        }

        res.render("edit.ejs", { post });
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).send("Server error");
    }
});
app.post("/edit/:id", isLoggedIn, async (req, res) => {
    try {
        const { content } = req.body;

        // Find the post and verify ownership
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (!post.user.equals(req.user.userid)) {
            return res.status(403).send("Unauthorized to edit this post");
        }

        // Update the content and save
        post.content = content;
        await post.save();

        res.redirect("/profile");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Server error");
    }
});


app.get("/like/:id", isLoggedIn, async (req, res) => {
    try {
        // Fetch the post by ID
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Ensure likes array exists
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        // Check if user already liked the post
        const userId = req.user.userid; // Make sure userid exists in JWT payload
        if (post.likes.includes(userId)) {
            return res.status(400).send("You already liked this post");
        }

        // Add user ID to likes and save
        post.likes.push(userId);
        await post.save();

        res.redirect("/profile");
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).send("Server error");
    }
});



app.post("/post", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { content } = req.body; 
        if (!content) {
            return res.status(400).send("Post content cannot be empty");
        }
        const post = await postModel.create({
            user: user._id,
            content,
        });
        user.posts.push(post._id);
        await user.save();

        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


app.post("/register", async (req, res) => {
    let { email, password, username, name, age } = req.body;
    if (!username || !email || !password || !name || !age) {
        return res.status(400).send("All fields are required");
    }
    if (isNaN(age)) {
        return res.status(400).send("Age must be a number");
    }
    let user = await userModel.findOne({ email: email });
    if (user) return res.status(500).send("User already registered");
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send("Error generating salt");
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error hashing password");
            try {
                let newUser = await userModel.create({
                    username,
                    email,
                    age: Number(age),
                    name,
                    password: hash,
                });
                let token = jwt.sign({ email: newUser.email, userid: newUser._id }, "SecretKey");
                res.cookie("token", token);
                res.status(201).send("User registered successfully");
            } catch (error) {
                res.status(500).send("Error creating user");
            }
        });
    });
});


function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login")
    }
    try {
        const data = jwt.verify(token, "SecretKey");
        req.user = data;
        next();
    } catch (err) {
        return res.status(403).send("Invalid token");
    }
}

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
