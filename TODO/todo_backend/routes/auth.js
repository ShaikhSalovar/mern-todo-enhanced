const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const TodoModel = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// JWT Secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_2024';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        console.log('=== REGISTRATION ATTEMPT ===');
        console.log('Request body:', req.body);

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (name.length < 3) {
            console.log('Validation failed: Name too short');
            return res.status(400).json({ message: 'Name must be at least 3 characters' });
        }

        if (password.length < 8) {
            console.log('Validation failed: Password too short');
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Check if user exists
        console.log('Checking if user exists...');
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user (password will be hashed by pre-save hook)
        console.log('Creating user...');
        const user = await UserModel.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });

        console.log('User created:', user._id);

        // Generate token
        console.log('Generating token...');
        const token = generateToken(user._id);
        console.log('Token generated successfully');

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.toJSON(),
        });

        console.log('=== REGISTRATION SUCCESS ===');
    } catch (error) {
        console.error('=== REGISTRATION ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        console.log('=== LOGIN ATTEMPT ===');
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        console.log('=== LOGIN SUCCESS ===');
        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user statistics
        const [totalTasks, completedTasks] = await Promise.all([
            TodoModel.countDocuments({ userId: req.userId }),
            TodoModel.countDocuments({ userId: req.userId, status: 'completed' }),
        ]);

        const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            user: user.toJSON(),
            stats: {
                totalTasks,
                completedTasks,
                successRate,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, phone, location, bio } = req.body;

        // Validation
        if (name && name.length < 3) {
            return res.status(400).json({ message: 'Name must be at least 3 characters' });
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await UserModel.findOne({
                email: email.toLowerCase(),
                _id: { $ne: req.userId }
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email.toLowerCase();
        if (phone !== undefined) updateData.phone = phone;
        if (location !== undefined) updateData.location = location;
        if (bio !== undefined) updateData.bio = bio;

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Profile updated successfully',
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        // Get user with password
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token and get user
// @access  Private
router.get('/verify', auth, async (req, res) => {
    try {
        res.json({ user: req.user.toJSON() });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
