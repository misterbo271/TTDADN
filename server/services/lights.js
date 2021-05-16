const Light = require("../model/Lights");

const createLight = async (nameLight, floorId) => {
  return await Light.create({
    nameLight: nameLight,
    status: 0,
    floor: floorId,
  });
};

const getAllLight = async (floorId) => {
  return await Light.find({ floor: floorId });
};

const updateLight = async (lightObj, updateCondition) => {
  return await Light.findOneAndUpdate(updateCondition, lightObj, { new: true });
};

const updateManyLight = async (lightObj, updateCondition) => {
  return await Light.updateMany(updateCondition, lightObj);
};

const deleteLight = async (deleteCondition) => {
  return await Light.findOneAndDelete(deleteCondition);
};

module.exports = {
  createLight,
  getAllLight,
  updateLight,
  updateManyLight,
  deleteLight,
};
