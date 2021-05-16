const { Router } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const argon2 = require("argon2");
const { requireUser } = require("../middleware/auth");
const { generateToken } = require("../services/token");
const User = require("../model/User");
const userRouter = Router({ mergeParams: true });

const {
  createUser,
  findUserByUserName,
  findById,
  verifyPassword,
} = require("../services/users");
const { findOne } = require("../model/User");

userRouter
  .get("/", requireUser, async (req, res, next) => {
    try {
      // const username = req.user.username;
      // console.log({ userID: userID });
      // findUserByUserName(username).then((user) => {
      console.log(req.user);
      const user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }
      res.json({ success: true, user });
      // });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  })

  .post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username not empty" });
    }

    if (!password) {
      return res.status(400).json({ message: "password not empty" });
    }
    try {
      findUserByUserName(username)
        .then((foundUser) => {
          if (foundUser) {
            res
              .status(400)
              .json({ success: false, message: `Username is existing !!` });
            return;
          }
          return Promise.resolve(true);
        })
        .then(() => {
          return createUser(username, password)
            .then((createdUser) => {
              generateToken(res, createdUser);
              res.status(201).json({ success: true, user: createdUser });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({ success: false, message: error });
            });
        });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal error" });
    }
  })

  .post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username and/or password" });
    }

    try {
      // findUserByUserName(username).then(async (foundUser) => {
      const foundUser = await User.findOne({ username });

      if (!foundUser)
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });
      const passwordValid = await argon2.verify(foundUser.password, password);
      if (!passwordValid)
        return res.status(400).json({
          success: false,
          message: "Incorrect username or password",
        });

      // await generateToken(res, user);
      const accessToken = jwt.sign({ user: foundUser }, JWT_SECRET);

      return res.json({
        success: true,
        message: "Loggin successfully",
        accessToken: accessToken,
      });
      // });
    } catch (error) {
      return res.status(500).json({ message: "Internal error" });
    }
  })
  .get("/login", requireUser, (req, res) => {
    res.json(req.user);
  })
  .get("/logout", (req, res) => {
    res.cookie("token", null, { maxAge: -1 });
    res.redirect("/");
  });

module.exports = userRouter;
