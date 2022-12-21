const User = require('../../models/user.model');
const verify = require('../authVerify')

const router = require("express").Router()

router.get('/q', verify, async (req, res) => {
    const { item } = req.query
    try {
        const results = await User.find({
            "email": {
                $regex: item,
                $options: "i"
            }
        }).exec();
        res.status(200).json(results)
    }
    catch (err) {
        res.status(500).json({error : err})
    }
})

router.get('/get-users', verify, async (req, res) => {
    const {items} = req.query;
    const ids = items.split(',')
    ids.pop()
    try {

        const users = await User.find({
            '_id' : {
                $in : ids
            }
        }).exec()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.post('/update-bio', verify, async (req, res) => {
    const {userId, bio} = req.body;
    try {
        const user = await User.findById(userId).exec();
        user.bio = bio;
        await user.save();
        res.status(200).send("bio updated.")
    }
    catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router