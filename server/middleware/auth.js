const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const userService = require("../services/users");

const requireUser = (req, res, next) => {
  const authHeader = req.header("token") || req.header("Authorization") || "";
  console.log("ok");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    console.log({ decode: decode });
    userService.findById(decode.user._id).then((user) => {
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = {
  requireUser,
};
