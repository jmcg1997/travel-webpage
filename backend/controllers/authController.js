import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import validateEmail from '../utils/validateEmail.js';
import Destination from '../models/Destination.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Basic input validation
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'All fields (email, username, password) are required.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // Generate email verification token
        const verificationToken = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Simulate email sending by logging the verification link
        console.log(`🔗 Email verification link: http://localhost:5001/api/auth/verify-email?token=${verificationToken}`);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found. Please register first.' });
        }

        // Ensure user has verified their email
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Respond with token and user info
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                description: user.description,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Delete logged-in user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user account.' });
    }
};

// Send password reset token to email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Protect specific email from being reset
        if (email === process.env.PROTECTED_EMAIL) {
            return res.status(403).json({ message: "This account cannot be modified." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        // Generate short-lived reset token (15 min)
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Save token to user
        user.resetPasswordToken = resetToken;
        await user.save();

        // Simulate sending password reset link
        console.log(`🔗 Password reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

        res.status(200).json({
            message: 'Password reset link generated successfully.',
            resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Error processing password reset.' });
    }
};

// Set a new password using a valid token
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        // Verify token and extract payload
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findById(payload.userId);
        if (!user || user.resetPasswordToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = ''; // Clear used token

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

// Email verification endpoint
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is required.' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email has been verified successfully.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email.' });
    }
};

// Update user profile fields
export const updateProfile = async (req, res) => {
    try {
        const { username, description, birthDate } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update only the provided fields
        user.username = username ?? user.username;
        user.description = description ?? user.description;
        user.birthDate = birthDate ?? user.birthDate;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile." });
    }
};

// Remove user's profile image
export const removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.profileImage = "";
        await user.save();

        res.status(200).json({ message: "Profile image removed successfully." });
    } catch (error) {
        console.error("Error removing profile image:", error);
        res.status(500).json({ message: "Error removing profile image." });
    }
};

// Change current password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required." });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Validate current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password." });
    }
};

// Get full profile data with stats
export const getProfileData = async (req, res) => {
    try {
        // Retrieve user from DB
        const user = await User.findById(req.user._id);

        // Count total destinations and favorites
        const totalDestinations = await Destination.countDocuments({ user: user._id });
        const totalFavorites = await Destination.countDocuments({ user: user._id, isFavorite: true });

        res.status(200).json({
            user: {
                email: user.email,
                username: user.username,
                description: user.description,
                profileImage: user.profileImage,
                birthDate: user.birthDate || null,
            },
            stats: {
                totalDestinations,
                totalFavorites,
            },
            gallery: user.uploads,
        });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Error fetching profile data." });
    }
};

