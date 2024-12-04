const express=require("express");
const app=express();

app.get("/",function(req,res){
    res.send("This is local host 3000");
})

app.listen(3000)