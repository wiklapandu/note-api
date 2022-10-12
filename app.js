const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const cors = require("cors");

require("dotenv").config();
require("./db/connect");

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

/* Models */
const { User } = require("./model/User");
const { Note } = require("./model/Note");

app.use(cors());
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

router.get("/", (req, res) => {
  return res.json("test");
});

router.get("/note", checkToken, (req, res) => {
  const user = req.user;

  Note.find({ userId: user._id })
    .then((notes) => {
      let arrNote = notes.map((note) => {
        return {
          id: note._id,
          title: note.title,
          slug: note.slug,
          desc: note.desc,
          created_at: note.created_at,
          updated_at: note.updated_at,
        };
      });

      res.json({
        status: "success",
        notes: arrNote,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: err,
      });
    });
});

router.get("/user", checkToken, (req, res) => {
  const user = req.user;
  res.json({
    status: "success",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

router.put("/user", checkToken, (req, res) => {
  const user = req.user;
  const { name } = req.body;
  if (!name) {
    res.json({
      status: "fail",
      error: "Name Required",
    });
    return;
  }

  User.findOneAndUpdate({ _id: user._id }, { name }, { new: true })
    .then((user) => {
      res.json({
        status: "success",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: err,
      });
    });
});

router.get("/note/:id", checkToken, (req, res) => {
  const { id } = req.params;
  const user = req.user;

  Note.findOne({ _id: id, userId: user._id })
    .then((note) => {
      res.json({
        status: "success",
        note: {
          id: note._id,
          title: note.title,
          slug: note.slug,
          desc: note.desc,
          created_at: note.created_at,
          updated_at: note.updated_at,
        },
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: "Note not found",
      });
    });
});

router.delete("/note/:id", checkToken, (req, res) => {
  const { id } = req.params;
  const user = req.user;
  Note.findOneAndDelete({ _id: id, userId: user._id })
    .then(() => {
      res.json({
        status: "success",
        message: "Note has deleted",
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: err,
      });
    });
});

router.put("/note/:id", checkToken, (req, res) => {
  const { id } = req.params;
  const { title, desc } = req.body;
  const date = new Date();

  const user = req.user;

  Note.findOneAndUpdate(
    { _id: id, userId: user._id },
    {
      title,
      slug: slugify(title) + `-${date.getTime()}`,
      desc,
      updated_at: date.getTime(),
    }
  )
    .then((note) => {
      res.json({
        status: "success",
        note: {
          id: note._id,
          title: note.title,
          slug: note.slug,
          desc: note.desc,
          created_at: note.created_at,
          updated_at: note.updated_at,
        },
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: err,
      });
    });
});

router.post("/note", checkToken, (req, res) => {
  const user = req.user;
  const { title, desc } = req.body;
  const date = new Date();
  Note.create({
    title,
    userId: user._id,
    slug: slugify(title) + `-${date.getTime()}`,
    desc,
    created_at: date.getTime(),
    updated_at: date.getTime(),
  })
    .then((note) => {
      res.json({
        status: "success",
        note: {
          id: note._id,
          title: note.title,
          slug: note.slug,
          desc: note.desc,
          created_at: note.created_at,
          updated_at: note.updated_at,
        },
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        error: err,
      });
    });
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
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.json({
      status: "fail",
      error: "Name, Email, and Password is required",
    });
    return;
  }
  User.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  })
    .then((user) => {
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
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
