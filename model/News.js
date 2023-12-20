import mongoose, { Schema } from "mongoose";

const newsSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: [
      "Latest",
      "Trending",
      "International",
      "Sport",
      "Economics",
      "Breaking",
    ],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  liked_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  disliked_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
      date: {
        type: Date,
        default: Date.now
      },
    },
  ],
});

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;
