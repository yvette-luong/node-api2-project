const express = require("express");

const postsRouter = require("./post/post-router")

const server = express();

server.use(express.json());
// endpoints 

// when the url of the request begins with /api/posts use the router
server.use("/api/posts", postsRouter);



server.get("/", (req, res) => {
    res.status(200).json({ api: "working", query: req.query });
});

server.get("/posts/:id", (req, res ) => {
    res.status(200).json({greeting:"testing"})
}) 

const port = 5000;
server.listen(port, () => {
    console.log("\n*** Server Running on http://localhost:5000 ***\n");
}); 

