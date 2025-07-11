import mongoose from 'mongoose';

// Connect to MongoDB Atlas using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    /* 
    // These options are no longer necessary in recent versions of Mongoose:
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } 
    */
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    // Log the error and exit the process if connection fails
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Stop the server if connection fails
  }
};

export default connectDB;
