const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
//@route    Post api/auth
//@desc     register user
//@access   public
router.post('/', [
    check('name', 'name is required')
        .not()
        .isEmpty(),
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please enter a with more than 6 chars')
        .isLength({ min: 6 })
],async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {name,email,password} = req.body
    try{
        let user = await User.findOne({email})
        //check user already exists
        if (user){
            return res
            .status(400)
            .json({errors:[{msg: 'User already exists'}]})
        }
        //get gravatar for user
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        })
        
        // encrypt password
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt);

        await user.save()
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, 
        config.get('jwtSecret'),
        {expiresIn: 3600000},
        (err,token) => {
            if(err) throw err
            res.json({token})
        })
    }
    catch(e){
        console.log(e.message)
        res.send(500).send('Internal server error')  
    }
})

module.exports = router