const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const path= require("path");
const userModel=require("./models/user");
const bcrypt=require("bcrypt");
const { log } = require("console");
const jwt=require("jsonwebtoken")

app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
    res.render("index.ejs")
})

app.post('/create', (req, res) => {
    console.log("Request body:", req.body); // Log incoming data
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            console.log(hash);
            if (!username || !email || !password || !age) {
                return res.status(400).send("All fields (username, email, password, age) are required.");
            }
        
            try {
                let createdUser = await userModel.create({ username, email, password:hash, age });
                res.send(createdUser);
            } catch (error) {
                console.error("Error creating user:", error); // Log full error details
                res.status(500).send(`Error creating user: ${error.message}`);
            }
        })
    })
    jwt.sign({email},"Secret");
    res.cookie("token",token);


});
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user = await userModel.findOne({ email });

        if (!user) {
            // If no user is found, respond with an error
            return res.status(404).send("User not found");
        }

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error during password comparison:", err);
                return res.status(500).send("Error during login");
            }

            if (!isMatch) {
                return res.status(401).send("Invalid password");
            }

            // Generate a JWT token if the password matches
            const token = jwt.sign({ email: user.email }, "Secret", { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true });
            return res.send("Login successful");
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Server error during login");
    }
});


//logout code
app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
})

app.listen(3000);












// Basic Steps
// CREATE USER ACCOUNT
    //Mongoose
    //schema
    //model
    //usercreate->password->hash
    //jwt token->cookie

// login -> token -> decrypt -> email