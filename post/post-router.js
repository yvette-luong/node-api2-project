const express = require("express");
const { update } = require("../data/db");
const Posts = require("../data/db");
const router = express.Router();

// makes a GET request to /api/posts
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved",
      });
    });
});

// makes a GET request to /api/posts/:id

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

// makes a GET request to /api/posts/:id/comments 

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = Posts.findPostComments(id)
        .then((post)=>{ 
            if (!comment) { 
                res.status(404).json({message: "not found"}) 
            } if (comment) {
            res.status(200).json(comment)
        } else {
            res.status(500).json({ message : "big big big error"})
        }
    })
})

//makes a POST request to /api/posts
router.post("/", (req, res) => {
  if (req.body.title && req.body.contents) {
    Posts.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        // log error to database
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});

// makes a POST request to /api/posts/:id/comments
router.post("/:id/comments", (req, res) => {
  const content = req.body;
  const id = req.params.id;
  Posts.findById(id).then((post) => {
    if (!post) {
      res.status(404).json({ message: " Error " });
    }
    if (content.text === "") {
      res
        .status(400)
        .json({ message: "Please provide text for the comment. " });
    }
    if (content) {
      content.post_id = id;
      Posts.insertComment(content);
      res.status(201).json(post);
    } else {
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved " });  
    }
  });
});

//makes a PUT request to /api/posts/:id
router.put("/:id", (req,res) => {
    const id = req.params.id;
    const updating = req.body; 

    Posts.findById(id)
    .then((post) => {
        if(!post) {
            res.status(404).json({message:" Error for PUT request"})
        } if (updating.title === "" || updating.content === "" ) {
            res.status(400).json({ message:" Provide title and contents for the post "})
        } if (updating && post) {
            Posts.update(id, updating);
            res.status(200).json(updating)
        } else {
            res.status(500).json({ message : " bomb error! "})
        }
    })
})



//makes a DELETE request to /api/posts/:id

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((id) => {
      if (id > 0) {
        res.status(200).json({ message: "exposed!" });
      } else {
        res.status(404).json({ message: "Post could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the Post",
      });
    });
});

module.exports = router;
