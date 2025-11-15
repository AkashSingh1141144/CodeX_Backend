import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

// ======================
// Video Schema Definition
// ======================
const videoSchema = new Schema(
  {
    // Actual video file URL (Cloudinary or any storage service)
    videoFile: {
      type: String,
      required: true
    },

    // Thumbnail image URL for the video
    thumbnail: {
      type: String,
      required: true
    },

    // Title of the video
    title: {
      type: String,
      required: true
    },

    // Description of the video content
    description: {
      type: String,
      required: true
    },

    // Total duration of video (in seconds)
    duration: {
      type: Number,
      required: true
    },

    // How many views this video has
    views: {
      type: Number,
      default: 0      // New video → 0 views initially
    },

    // Whether video is published or still private/draft
    isPublished: {
      type: Boolean,
      default: false   // False → admin/owner will publish manually
    },

    // Owner of the video (reference to User model)
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
      // This makes relation: Video belongs to a single User
    }
  },
  { timestamps: true }   // adds createdAt + updatedAt fields automatically
)

// ===================================================
// Adding pagination plugin for aggregate queries
// Helps with: search, filtering, sorting, pagination
// ===================================================
videoSchema.plugin(mongooseAggregatePaginate)

// Exporting Model
export const Video = mongoose.model('Video', videoSchema)
