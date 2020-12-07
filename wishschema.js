const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    Title: {
      type: String,

      trim: true,
      min: 1,
      max: 21,
    },
    Heading: {
      type: String,

      trim: true,
      min: 1,
      max: 21,
    },
    Priority: {
      type: String,
      trim: true,
      index: true,
    },
    Pic: {
      type: String,
      trim: true,
    },
    Category: {
      type: String,
      trim: true,
    },
    Subject: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
