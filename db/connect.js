const mongoose = require("mongoose");
require("dotenv").config();

const db_url = process.env.MONGO_URL;
mongoose.connect(db_url).catch((err) => console.log(err));
