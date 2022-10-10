const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => {
  return res.json("test");
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  return res.json({
    status: "success",
    user: {
      email,
    },
  });
});

router.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  return res.json({});
});

router.get("/", (req, res) => {
  return res.json({
    message: "login in /api/login before use this api",
  });
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Running in port ${port}`);
});
