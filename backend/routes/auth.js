const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password , email, number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, number });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.log(error);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select(-password);
        if (!user) return res.status(404).send('User not found');
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');
    
        const token = jwt.sign({ id: user._id }, 'JWT_SECRET');
        res.json({ token, user }); 
    } catch (error) {
        console.log(error)
    }
    
});

module.exports = router;
