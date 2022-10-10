const mongoose = require("mongoose");

const db_url = "mongodb://localhost:27017/note-app";
mongoose.connect(db_url).catch((err) => console.log(err));
