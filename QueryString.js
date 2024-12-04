const express=require("express");
const app=express();

app.get("/",function(req,res){
    res.send("This is local host 3000");
})

app.get("/search",(req,res)=>
{
    console.log(req.query);
    let q=req.query();
    res.send(`results:${q}`);
})

app.listen(3000)