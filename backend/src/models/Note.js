import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["personal", "work", "study", "other"],
      default: "other",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: "#ffffff",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
