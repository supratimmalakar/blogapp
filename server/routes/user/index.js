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
    const {userId} = req.params
    try {
        const user = await User.findById(userId).exec();
        res.status(200).send(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router