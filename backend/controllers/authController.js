const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    
    // Check if user with same email and role already exists
    const existingUser = await User.findOne({ username, role });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email and role already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        // First check if user exists with the given username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Then verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Finally, verify the role matches exactly
        if (user.role !== role) {
            return res.status(400).json({ 
                message: `Invalid role. This email is registered as a ${user.role}, not as an ${role}` 
            });
        }

        // If all checks pass, generate token
        const token = jwt.sign({ 
            id: user._id, 
            role: user.role, 
            username: user.username 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token, 
            role: user.role, 
            username: user.username 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};