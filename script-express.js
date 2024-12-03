const express=require("express");
const app =express();

//middle-ware
app.use(function(req,res,next){
    console.log("middleware chala")
    next();
});

app.get("/",function(req,res){
    res.send("Hello World");
})

app.get("/reeva",function(req,res){
    res.send("Reeva Ahuja is fat")
})
app.get("/about",function(req,res)
{
    res.send("this page contains info about page");
})
app.listen(3000)