//Step 1) project initialize
//Step 2) download express
//Step 3) Use parser
//Step 4) install ejs using npm
//Step 5) setup ejs as view engine
//Step 6) setup public static files(html css javascript image video)
const express=require('express');
const app= express();
const path = require('path');


app.use((express.json()));
app.use(express.static(path.join(__dirname,'public')))
//add "public" directory to current path
//telling express to lookfor static files in express.static
app.use(express.urlencoded({encoded:true}))
app.set('view engine','ejs');

app.get("/",function(req,res){
    res.render("index.ejs");
});
app.get("/about",function(req,res){
    res.send("About page");
})
app.listen(3000, function()
{
    console.log("server is live");
})