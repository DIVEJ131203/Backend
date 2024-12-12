const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase2");
const postSchema=mongoose.Schema({
    postdata:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("post",postSchema);