const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    }).select('+password')
    if (!user) {
        res.status(400).send("email doesn't exist");
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(400).send("Incorrect password");
        return;
    }

    try {
        const { error } = await loginSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        else {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

            userObj = {
                name: user.fname + ' ' + user.lname,
                email: user.email,
                id: user._id
            }
            const tokenObj = JSON.stringify({
                token,
                user: {
                    ...userObj
                }
            })
            res.cookie('blogToken', tokenObj, {
                httpOnly: false,
                sameSite: "none",
                secure: true,
                domain: 'blogapp-supratimmalakar.vercel.app'
            }).status(200).json({ message: 'success!' })
            res.send();
        }
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('blogToken', {
        secure: true,
    });
    res.status(200).json({
        "message": 'cookie cleared'
    })
})

router.post('/register', async (req, res) => {
    const emailExists = await User.findOne({
        email: req.body.email
    });

    if (emailExists) {
        res.status(400).send("Email already exists");
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        fname: req.body.fname.trim(),
        lname: req.body.lname.trim(),
        email: req.body.email.trim(),
        password: hashedPassword,
    });

    try {
        const { error } = await registerSchema.validateAsync(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            const saveUser = await user.save();
            res.status(200).send("user created");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
