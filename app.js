const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.json({
    message: "login in /api/login before use this api",
  });
});

app.get("/api/", (req, res) => {
  return res.json("test");
});

app.listen(port, () => {
  console.log(`Running in port ${port}`);
});
