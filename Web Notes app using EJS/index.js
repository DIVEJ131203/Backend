// Step 1) npm init -y
// Step 2) npm i express
// Step 3) npm i nodemon
// Step 4) npm i ejs
// Step 5) Boiler code for express
    // const express=require("express")
    // const app=express()

    // app.get("/",function(req,res)
    // {
    //     res.send("Main page")
    // })

    // app.listen(3000)



const express=require("express")
const app=express()
const path=require("path")
const fs=require("fs")

app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get("/",function(req,res)
{
    fs.readdir(`./files`,function(err,files)
{
console.log(files)
res.render("index.ejs",{files: files})
})
    
})
app.post("/create",function(req,res)
{
console.log(req.body)
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect("/");
    })
})


app.get("/files/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('show.ejs')
    })
})
app.listen(8080)