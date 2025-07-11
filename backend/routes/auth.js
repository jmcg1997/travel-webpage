import express from 'express';
import User from '../models/User.js';
import {
  registerUser,
  loginUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  removeProfileImage,
  changePassword,
  getProfileData,
} from '../controllers/authController.js';

import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/* ---------------------------
   🔐 AUTHENTICATION ROUTES
---------------------------- */

// Register a new user
router.post('/register', registerUser);

// Login with email and password
router.post('/login', loginUser);

// Verify user email manually
router.patch("/verify-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Server error during verification." });
  }
});

/* ---------------------------
   🔁 PASSWORD RECOVERY
---------------------------- */

// Request password reset link
router.post('/forgot-password', forgotPassword);

// Reset password using token
router.post('/reset-password', resetPassword);

/* ---------------------------
   👤 AUTHENTICATED USER ROUTES (REQUIRES JWT)
---------------------------- */

// Get current user info
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

// Update user profile (username, description, birthdate)
router.patch("/me", authMiddleware, updateProfile);

// Delete user account
router.delete('/me', authMiddleware, deleteUser);

// Remove user profile image
router.patch("/remove-profile-image", authMiddleware, removeProfileImage);

// Upload or update profile image
router.patch('/profile-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Update user with the new image URL
    req.user.profileImage = `/uploads/${req.file.filename}`;
    await req.user.save();

    res.status(200).json({ message: 'Profile image updated successfully.', imageUrl: req.user.profileImage });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ message: 'Error updating profile image.' });
  }
});

// Change user password
router.patch("/password", authMiddleware, changePassword);

// Update user birthdate
router.patch("/birthdate", authMiddleware, async (req, res) => {
  try {
    const { birthDate } = req.body;

    if (!birthDate) {
      return res.status(400).json({ message: 'Birth date is required.' });
    }

    req.user.birthDate = new Date(birthDate);
    await req.user.save();

    res.status(200).json({ message: 'Birth date updated successfully.' });
  } catch (error) {
    console.error('Error updating birth date:', error);
    res.status(500).json({ message: 'Error updating birth date.' });
  }
});

// Get user profile data with stats and gallery
router.get("/profile-data", authMiddleware, getProfileData);

/* ---------------------------
   🖼️ UPLOADS (IMAGES)
---------------------------- */

// Upload a new image with optional caption
router.post("/uploads", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded." });

    const { caption } = req.body;

    // Enforce 12-image limit
    if (req.user.uploads.length >= 12) {
      return res.status(400).json({ message: "Maximum of 12 uploads allowed." });
    }

    req.user.uploads.push({
      url: `/uploads/${req.file.filename}`,
      caption,
    });

    await req.user.save();

    res.status(201).json({ message: "Upload added.", uploads: req.user.uploads });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed." });
  }
});

// Delete image by index
router.delete("/uploads/:index", authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index);
    if (isNaN(idx) || idx < 0 || idx >= req.user.uploads.length) {
      return res.status(400).json({ message: "Invalid index." });
    }

    req.user.uploads.splice(idx, 1);
    await req.user.save();

    res.status(200).json({ message: "Upload removed.", uploads: req.user.uploads });
  } catch (err) {
    console.error("Delete upload error:", err);
    res.status(500).json({ message: "Could not delete upload." });
  }
});

export default router;
