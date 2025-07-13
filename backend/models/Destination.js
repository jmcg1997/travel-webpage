import mongoose from 'mongoose';

// Schema for user-created travel destinations
const destinationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who owns this destination
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['attraction', 'restaurant', 'hotel', 'general'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['wishlist', 'visited'],
    default: 'wishlist',
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  imageUrl: {
    type: String,
    default: "",
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Add geospatial index to support location-based queries
// destinationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Destination', destinationSchema);
