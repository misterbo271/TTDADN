const { Router } = require("express");

const router = Router({ mergeParams: true });

const userRoute = require("./users");
const floorRoute = require("./floors");
const lightRoute = require("./lights");

router.use("/users", userRoute);
router.use("/floors", floorRoute);
router.use("/lights", lightRoute);

module.exports = router;
