const { Router } = require("express");
const { requireUser } = require("../middleware/auth");
const {
  createFloor,
  getAllFloor,
  updateFloor,
  deleteFloor,
} = require("../services/floors");

const client = require("../mqtt/server");
const urlMqtt = "mandoansinh/feeds";

const floorRouter = Router({ mergeParams: true });

floorRouter
  .get("/", requireUser, (req, res, next) => {
    const userID = req.user._id;
    getAllFloor()
      .then((floors) => {
        res.json({ success: true, floors: floors });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  })

  .post("/", requireUser, async (req, res) => {
    const { nameFloor } = req.body;

    await createFloor(nameFloor)
      .then((createdFloor) => {
        res.json({ success: true, createdFloor: createdFloor });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal error" });
      });
  })

  .put("/:floorId", requireUser, async (req, res) => {
    const { nameFloor, autoMode, sensor } = req.body;

    const updatedFloor = {
      nameFloor,
      autoMode,
      sensor,
    };
    const updateCondition = { _id: req.params.floorId };

    await updateFloor(updatedFloor, updateCondition)
      .then((Floor) => {
        let val = 0;
        if (Floor.sensor === "00") {
          val = 0;
        } else if (Floor.sensor === "01") {
          val = 1;
        } else if (Floor.sensor === "10") {
          val = 2;
        } else if (Floor.sensor === "11") {
          val = 3;
        }

        let data = { value: `${val}` };
        client.publish(`${urlMqtt}/${Floor.nameFloor}`, JSON.stringify(data));
        res.json({ success: true, updatedFloor: Floor });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).json({
          success: false,
          message: "Floor not found or user not authorised",
        });
      });
  })
  .delete("/:floorId", requireUser, async (req, res, next) => {
    const floorId = req.params.floorId;
    const deleteCondition = { _id: floorId };
    await deleteFloor(deleteCondition)
      .then(() => {
        res.json({ success: true, message: "Delete successfully" });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      });
  });

module.exports = floorRouter;
