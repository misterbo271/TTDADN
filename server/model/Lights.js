const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lightSchema = new Schema({
  //   wattage: {
  //     type: Float32Array,
  //     required: true,
  //   },
  nameLight: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    enum: [0, 1],
  },
  floor: {
    type: Schema.Types.ObjectId,
    ref: "floors",
  },
});

const light = mongoose.model("lights", lightSchema);
module.exports = light;
