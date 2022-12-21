const Post = require('../../models/post.model');
const verify = require('../authVerify');
const User = require('../../models/user.model')

const router = require("express").Router();

router.post('/create-post', verify, async (req, res) => {
    const { title, content, userId } = req.body;
    try {
        const user = await User.findById(userId).exec();
        const name = user.fname + " " + user.lname;
        const email = user.email;
        const post = new Post({
            title: title,
            content: content,
            createdBy: {
                name,
                email,
                id: userId
            }
        })
        user.posts.push(post._id);
        await user.save();
        await post.save();
        res.status(200).send("post created")
    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.get('/:userId', verify, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).exec();
        let posts = await Post.find({
            '_id': {
                $in: user.posts
            }
        }).sort({ createdAt: -1 }).exec()
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(400).json(err);
    }
})

router.get('/all-posts', verify, async (req, res) => {
    try {
        const posts = await Post.find().exec();
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(400).json(err)
    }
});




module.exports = router