// implement your posts router here
const express = require('express');
const router = express.Router();
const Post = require('./posts-model.js');

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The posts information could not be retrieved" });
        })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The post information could not be retrieved" });
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert({ title, contents })
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" });
            })
    }
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    const { id } = req.params;

    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.update(id, { title, contents })
            .then(post => {
                if (!post) {
                    res.status(404).json({ message: "The post with the specified ID does not exist" });
                } else {
                    res.status(200).json(post);
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The post information could not be modified" });
            })
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Post.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                Post.remove(id)
                    .then(posts => {
                        res.json(posts);
                    })
                    .catch(err => {
                        res.status(500).json({ message: "The post could not be removed" });
                    })        
            }
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    Post.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                Post.findPostComments(id)
                    .then(comments => {
                        res.json(comments);
                    })
                    .catch(err => {
                        res.status(500).json({ message: "The post could not be removed" });
                    })        
            }
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router;