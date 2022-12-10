const User = require('../../models/user.model');
const verify = require('../authVerify')

const router = require("express").Router()

router.get('/allusers', verify, async (req, res) => {
    try {
        // console.log("user", req.user);
        const results = await User.find().exec();
        res.status(200).send(results);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.get('/:userId', verify, async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId).exec();
        res.status(200).send(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.post('/follow', verify, async (req, res) => {
    const { follower, followed } = req.body;
    try {
        const followedUser = await User.findById(followed).exec();
        const followerUser = await User.findById(follower).exec();
        followedUser.followers.push(follower);
        followerUser.following.push(followed);
        await followedUser.save();
        await followerUser.save();
        res.status(200).send("User followed")
    }
    catch (err) {
        res.status(500).json({ err })
    }
})

router.post('/unfollow', verify, async (req, res) => {
    const { unfollower, unfollowed } = req.body;
    try {
        const unfollowedUser = await User.findById(unfollowed).exec();
        const unfollowerUser = await User.findById(unfollower).exec();
        const unfollowerIdx = unfollowedUser.followers.indexOf(unfollower);
        const unfollowedIdx = unfollowerUser.following.indexOf(unfollowed);
        unfollowedUser.followers.splice(unfollowerIdx, 1);
        unfollowerUser.following.splice(unfollowedIdx, 1);
        await unfollowedUser.save();
        await unfollowerUser.save();
        res.status(200).send("User unfollowed")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
})

router.get('/search', verify, async (req, res) => {
    const {q} =  req.query
    try {
        const users = await User.find({
            "email" : {
                '$regex' : q,
                '$options' : "i"
            }
        }).exec();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router