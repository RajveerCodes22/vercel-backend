import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },

    classLevel: {
      type: String,
      required: true,
    },

    examType: {
      type: String,
      required: true,
    },

    revisionMode: {
      type: Boolean,
      default: false,
    },

    includeDiagrams: Boolean,
    includeChart: Boolean,
    

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);

export default NoteModel;