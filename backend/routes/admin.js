const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/users', auth, async (req, res) => {
    const users = await User.find();
    console.log('hi')
    res.json(users);
});

// Create user
router.post('/users', auth, async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send('User deleted');
});

// Edit user
router.put('/users/:id', auth, async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { username, password: hashedPassword });
    res.send('User updated');
});

module.exports = router;
