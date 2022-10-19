const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    default: "red",
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  desc: {
    type: String,
  },
});

exports.Note = mongoose.model("Note", NoteSchema);
