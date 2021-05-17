const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

//@route    Post api/post
//@desc     Create a POst
//@access   private
router.post('/', [auth, [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save()

        res.json(post)
    }
    catch (e) {
        console.log(e.message)
        res.status(500).send('server error')
    }

})

//@route    Get api/post
//@desc     Get all posts
//@access   private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    }
    catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

//@route    Get api/post/:id
//@desc     Get post by id
//@access   private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found' })
        }
        res.json(post)
    }
    catch (e) {
        console.error(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found' })
        }
        res.status(500).send('Server error')
    }
})

//@route    Delete api/post/:id
//@desc     Delete post by id
//@access   private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found' })
        }

        //Check User
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }
        await post.remove()
        res.json({ msg: 'Post removed' })
    }
    catch (e) {
        console.error(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found' })
        }
        res.status(500).send('Server error')
    }
})

//@route    PUT api/post/like/:id
//@desc     Like a post
//@access   private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'post already liked' })
        }
        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

//@route    PUT api/post/like/:id
//@desc     Unlike a post
//@access   private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'post has not yet liked' })
        }
        //Get remove index
        removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

//@route    Post api/posts/comment/:id
//@desc     Comment on a post
//@access   private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment)

        await post.save()

        res.json(post.comments)
    }
    catch (e) {
        console.log(e.message)
        res.status(500).send('server error')
    }

})

//@route    Post api/posts/comment/:id/:comment_id
//@desc     Delete Comment on a post
//@access   private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //pull da comment

        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        //check if exists 
        if (!comment) {
            return res.status(404).json({ msg: 'comment does not exits' })
        }

        //check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not authorized' })
        }

        //Get remove index
        removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)
    } catch (e) {
        console.log(e.message)
        res.status(500).send('server error')
    }
})

module.exports = router