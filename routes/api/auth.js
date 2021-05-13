const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
//@route    Get api/profile
//@desc     Test route
//@access   public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }
    catch (e) {
        res.status(500).send('server error')
    }
})

//@route    Post api/auth
//@desc     auth user and get token
//@access   public
router.post('/', [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is required')
        .exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        //check user already exists
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            })
    }
    catch (e) {
        console.log(e.message)
        res.send(500).send('Internal server error')
    }
})

module.exports = router