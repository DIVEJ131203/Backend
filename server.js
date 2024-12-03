const http= require("http");
const server=http.createServer(function(req,res){
res.end("hello listening to port 3000");
})
server.listen(3000);
