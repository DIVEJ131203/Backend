const express=require('express');
const app= express();
app.use((express.json));
app.use(express.urlencoded({encoded:true}))
app.get("/",function(req,res){
    res.send("I am divej")
})
app.listen(3000)