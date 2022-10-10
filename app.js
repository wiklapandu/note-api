const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
require("./db/connect");

const app = express();
const router = express.Router();
const port = 3000;

/* Models */
const { User } = require("./model/User");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* helper function */
function fetchUserByToken(req) {
  return new Promise((resolve, reject) => {
    if (req.headers && req.headers.authorization) {
      let auth = req.headers.authorization;
      let decoded;

      try {
        decoded = jwt.verify(auth, process.env.SECRET_JWT_CODE);
      } catch (e) {
        reject("Invalid Token");
        return;
      }

      let userId = decoded.id;
      User.findOne({ _id: userId })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject("Token error");
        });
    } else {
      reject("No Token Found");
    }
  });
}

/* middleware function */

function checkToken(req, res, next) {
  fetchUserByToken(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      res.json({
        status: "fail",
        error: err,
      });
    });
}

router.get("/", checkToken, (req, res) => {
  return res.json("test");
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      status: "fail",
      error: "Email and Password is required",
    });
    return;
  }
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.json({ status: "fail", error: "User doesn't exist" });
    } else {
      if (!bcrypt.compareSync(password, user.password)) {
        res.json({ status: "fail", error: "wrong password" });
      } else {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.SECRET_JWT_CODE
        );
        res.json({ status: "success", token });
      }
    }
  });
});

router.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      status: "fail",
      error: "Email and Password is required",
    });
    return;
  }
  User.create({
    email,
    password: bcrypt.hashSync(password, 10),
  })
    .then((user) => {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_JWT_CODE
      );
      res.json({ status: "success", token });
    })
    .catch((err) => res.json({ status: "error", error: err }));
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
