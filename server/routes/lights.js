const { Router } = require("express");
const { requireUser } = require("../middleware/auth");
const {
  createLight,
  getAllLight,
  updateLight,
  deleteLight,
} = require("../services/lights");

const urlMqtt = "mandoansinh/feeds";

const { findById } = require("../services/floors");
const client = require("../mqtt/server");

const lightRouter = Router({ mergeParams: true });

lightRouter
  .get("/:floorId", requireUser, async (req, res, next) => {
    const floorId = req.params.floorId;
    getAllLight(floorId)
      .then(async (lights) => {
        await findById(floorId).then(async (floor) => {
          console.log(floor);
          if (floor.autoMode === 1 && floor.sensor === "11") {
            for (const i in lights) {
              const updatedLight = {
                nameLight: lights[i].nameLight,
                status: 1,
              };
              const updateCondition = {
                _id: lights[i]._id,
                floor: floorId,
              };
              await updateLight(updatedLight, updateCondition).then((light) => {
                // Main Data
                // let data = {
                //   id: "11",
                //   name: "RELAY",
                //   data: `${light.status}`,
                //   unit: "",
                // };

                // Sub Data
                let data = { value: `${light.status}` };
                client.publish(
                  `${urlMqtt}/${light.nameLight}`,
                  JSON.stringify(data)
                );
              });
            }
          }
        });
        res.json({ success: true, lights: lights });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  })

  .post("/:floorId", requireUser, async (req, res) => {
    const { nameLight } = req.body;
    const floor = req.params.floorId;

    await createLight(nameLight, floor)
      .then((createdLight) => {
        res.json({ success: true, createdLight: createdLight });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal error" });
      });
  })

  .put("/:floorId/:lightId", requireUser, async (req, res) => {
    const { nameLight, status } = req.body;
    const floorId = req.params.floorId;
    const lightId = req.params.lightId;
    // const count = light.find({floor: lightId}).count()

    const updatedLight = {
      nameLight,
      status,
    };
    const updateCondition = {
      _id: lightId,
      floor: floorId,
    };

    await updateLight(updatedLight, updateCondition)
      .then((Light) => {
        // Data main
        // let data = {
        //   id: "11",
        //   name: "RELAY",
        //   data: `${Light.status}`,
        //   unit: "",
        // };

        // Data sub
        let data = {
          value: `${Light.status}`,
        };
        client.publish(`${urlMqtt}/${Light.nameLight}`, JSON.stringify(data));
        res.json({ success: true, updatedLight: Light });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).json({
          success: false,
          message: "Light not found or user not authorised",
        });
      });
  })
  .delete("/:floorId/:lightId", requireUser, async (req, res, next) => {
    const floorId = req.params.floorId;
    const lightId = req.params.lightId;
    const deleteCondition = { _id: lightId, floor: floorId };
    await deleteLight(deleteCondition)
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

module.exports = lightRouter;
