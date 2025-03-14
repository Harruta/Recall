import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tweetId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true },
  authorId: { type: String, required: true }
}, {
  timestamps: true
});

// Create a compound index for userId and tweetId
BookmarkSchema.index({ userId: 1, tweetId: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
