const mongoose = require("mongoose");

const db_url = "mongodb://localhost:27017/note-app";
const main = async () => {
  await mongoose.connect(db_url);
};

main().catch((err) => console.log(err));
