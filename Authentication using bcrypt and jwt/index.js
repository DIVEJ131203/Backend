// AUTHENTICATION AND AUTHORIZATION STEPS
// Step 1) npm i jsonwebtoken
// Step 2) npm i bcrypt
        //  password is encrypted hashed using SHA-256 salt is appended
// Step 3) npm i cookie-parser

const express=require("express");
const app =express();
const cookieParser=require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");

app.use(cookieParser())

app.get("/",function(req,res){
    //10 here means salt rounds
bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash("myPasswordInPlainText",salt,function(err,hash){
        console.log(hash);
    })
})
bcrypt.compare("myPasswordInPlainText","$2b$10$SKCc3fKhEw4SMA23mM7Bd.G3Fsl0u66voBw0MJzjkE/fIoDsh82fq",function(err,result){
    console.log(result);
    res.send(result);
})
let token= jwt.sign({
    email:"divejahuja@gmail.com"},"secret")

    res.cookie("token",token)
    // res.send("done")
})

app.get("/read",function(req,res){
    console.log(req.cookies);
    res.send("read page")
    console.log(req.cookies.token);
    let data=jwt.verify(req.cookies.token,'secret');
    console.log(data);
})
//JWT
//Header + Payload(encrypted data) + Verify Signature(DS)
app.listen(3000);