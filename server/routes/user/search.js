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

module.exports = router