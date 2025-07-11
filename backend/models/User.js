import mongoose from 'mongoose';

// Schema for registered users
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
    },
    username: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true, // Hashed password
    },
    description: {
      type: String,
      default: '',
      maxlength: 160, // Optional user bio
    },
    birthDate: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String, // URL of the profile picture
      default: '',
    },
    uploads: [
      {
        url: { type: String },           // Image URL
        caption: { type: String, default: '' }, // Optional caption
        createdAt: { type: Date, default: Date.now }, // Timestamp
      },
    ],
    isVerified: {
      type: Boolean,
      default: false, // Indicates if the email has been verified
    },
    resetPasswordToken: {
      type: String,
      default: '', // Token used for password reset
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Limit user uploads to 12 most recent entries
userSchema.pre('save', function (next) {
  if (this.uploads.length > 12) {
    this.uploads = this.uploads.slice(0, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
