const express = require("express")
const Posts = require("../db.js");


const router = express.Router();

// makes a GET request to /api/posts
router.get("/", (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            error: "The posts information could not be retrieved",
        });
    });
}); 

// makes a GET request to /api/posts/:id: 

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist."})
            }        
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({ error:"The post information could not be retrieved",

            })
        })
})

//makes a POST request to /api/posts:
router.post("/", (req, res) => {
    if(req.body.title && req.body.contents) {
        Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
       
    }) 
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "There was an error while saving the post to the database",
            });
        });
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
});