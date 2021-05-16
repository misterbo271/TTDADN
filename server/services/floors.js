const Floor = require("../model/Floors");

const createFloor = async (nameFloor) => {
  return await Floor.create({
    nameFloor: nameFloor,
    autoMode: 0,
    sensor: "00",
  });
};

const getAllFloor = async () => {
  return await Floor.find();
};

const findById = async (id) => {
  return await Floor.findById(id);
};

const updateFloor = async (floorObj, updateCondition) => {
  return await Floor.findOneAndUpdate(updateCondition, floorObj, { new: true });
};

const deleteFloor = async (deleteCondition) => {
  return await Floor.findOneAndDelete(deleteCondition);
};

module.exports = {
  createFloor,
  getAllFloor,
  findById,
  updateFloor,
  deleteFloor,
};
