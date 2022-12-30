const Post = require('../../models/post.model');
const verify = require('../authVerify');
const User = require('../../models/user.model')

const router = require("express").Router();

router.get('/', verify, async (req, res) => {
    const { userId, pageMax, pageNo } = req.query;
    try {
        const user = await User.findById(userId).exec();
        const following = await User.find({
            '_id': {
                $in: user.following
            }
        }).exec()
        var feedPostIds = [];
        following.forEach(user => {
            feedPostIds = [...feedPostIds, ...user.posts]
        })
        const posts = await Post.find({
            '_id' : {
                $in : feedPostIds
            }
        }).sort({createdAt : -1}).exec()
        const feedPosts = posts.slice(0, pageMax*pageNo)

        
        res.status(200).json({
            posts : feedPosts,
            exhausted : posts.length <= pageMax*pageNo
        });
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.post('/like', verify, async (req, res) => {
    const {postId, userId} = req.body
    try {
        const post = await Post.findById(postId).exec();
        post.likes.push(userId);
        await post.save();
        res.status(200).send("post liked")
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.post('/unlike', verify, async (req, res) => {
    const { postId, userId } = req.body
    try {
        const post = await Post.findById(postId).exec();
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1)
        await post.save();
        res.status(200).send("post unliked")
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.get('/:postId', verify, async (req, res) => {
    const {postId} = req.params
    try {
        const post = await Post.findById(postId).exec();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.delete('/:postId', verify, async (req, res) => {
    const {postId} = req.params;
    try {
        await Post.findByIdAndDelete(postId);
        res.status(200).send("Post deleted")
    }
    catch (err) {
        res.status(400).send(err)
    }
})
module.exports = router