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
  desc: {
    type: String,
  },
});

exports.Note = mongoose.model("Note", NoteSchema);
