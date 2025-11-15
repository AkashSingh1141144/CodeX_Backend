import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// ======================
// User Schema Definition
// ======================
const userSchema = new Schema(
  {
    // Unique username for each user
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,        // Remove extra spaces
      lowercase: true,   // Convert to lowercase
      index: true        // Improves search performance
    },

    // User's email address (must be unique)
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },

    // Encrypted password (will not store plain text)
    password: {
      type: String,
      required: [true, 'password is required']
    },

    // Full name of the user
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    // Avatar image (Cloudinary URL)
    avatar: {
      type: String, 
      required: true
    },

    // Cover image (Cloudinary URL)
    coverImage: {
      type: String,
      
    },

    // List of videos the user has watched
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video'
      }
    ],

    // Refresh token stored in DB for authentication
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }   // Automatically adds createdAt & updatedAt fields
)

// ============================================
// Mongoose Middleware: Hash password before save
// ============================================
userSchema.pre('save', async function(next) {

  // If password was NOT modified, skip hashing
  if (!this.isModified('password')) return next()

  // Hash the password with salt rounds = 10
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// ===============================
// Method to check if password is correct
// ===============================
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}
// bcrypt.compare() → user input password vs stored hash

// ===============================
// Method: Generate Access Token (Short-lived)
// ===============================
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, // Access token secret key
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY // e.g. 15m, 1h
    }
  )
}

// ===============================
// Method: Generate Refresh Token (Long-lived)
// ===============================
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET, // Refresh token secret key
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY // e.g. 7d, 30d
    }
  )
}

// Exporting the User model
export const User = mongoose.model('User', userSchema)
