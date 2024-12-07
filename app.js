const express=require("express");
const app=express();
const userModel=require('./usermodel');

app.use(express.json());

app.get("/",(req,res)=>{
res.send("Hey");
})

app.get("/create",async (req,res)=>{
    let createduser= await userModel.create(
        {
            name:"Divej",
            username:"Divej Ahuja",
            email:"divejahuja@gmail.com"
        }
    )
    res.send(createduser);
    })

    app.get("/update",async (req,res)=>{
        let updateduser=await userModel.findOneAndUpdate({username:"Divej Ahuja"},{name:"Ayanika Paul"},{new:true})
        res.send(updateduser);
        })

        app.get("/read",async (req,res)=>{
            let users=await userModel.find()
            res.send(users);
            })

app.listen(3000);