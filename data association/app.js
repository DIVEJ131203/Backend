const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const app = express();


app.get("/", function (req, res) {
  res.send("Hey");
});


app.get("/create", async (req, res) => {
  try {
    let createdUser = await userModel.create({
      username: "Divej",
      age: 25,
      email: "divej@gmail.com",
    });
    res.send(createdUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.get("/post/create", async (req, res) => {
  try {
    let post = await postModel.create({
      postdata: "hello",
      user: "675a787716aadfd575448ba3", 
    });


    let user = await userModel.findOne({ _id: "675a787716aadfd575448ba3" });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.posts.push(post._id);

    
    await user.save();

    res.send({ post, user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
