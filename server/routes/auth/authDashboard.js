const User = require('../../models/user.model');
const verify = require('./authVerify')

const router = require("express").Router()

router.get('/allusers', verify ,async (req, res) => {
    try {
        console.log(req.user);
        const results = await User.find().exec();
        res.status(400).send(results);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router