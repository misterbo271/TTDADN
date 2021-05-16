const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const floorSchema = new Schema({
  nameFloor: {
    type: String,
    required: true,
  },
  autoMode: {
    type: Number,
    enum: [0, 1],
  },
  sensor: {
    type: String,
    enum: ["00", "01", "10", "11"],
  },
});

const floor = mongoose.model("floors", floorSchema);
module.exports = floor;
