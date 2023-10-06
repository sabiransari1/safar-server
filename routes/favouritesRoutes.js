const express = require("express");
const favouritesRoutes = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const favouriteModel = require("../models/favouriteModel");
const placeModel = require("../models/placeModel");

favouritesRoutes.use(authMiddleware);

favouritesRoutes.get("/favouritesplaces", async (req, res) => {
  try {
    const existingUserID = req.body.userID;

    const favouritesplaces = await favouriteModel.find({
      userID: existingUserID,
    });
    return res.status(200).send(favouritesplaces);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

favouritesRoutes.post("/addtofavourite/:_id", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const _id = req.params._id;
    const places = await placeModel.findById(_id);

    const favouritePlaces = await favouriteModel.create({
      ...places._doc,
      userID: existingUserID,
    });

    // favouritePlaces.populate();
    return res.status(200).send({
      msg: "Favourite place has been added successfully",
      favouritePlaces,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

favouritesRoutes.delete("/deletefavourite/:_id", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const _id = req.params._id;

    const places = await favouriteModel.findById(_id);

    if (places.userID.toString() === existingUserID) {
      const deletedFavouritePlace = await favouriteModel.findByIdAndDelete(_id);
      return res.status(200).send({
        msg: "Place has been deleted successfully",
        deletedFavouritePlace,
      });
    } else {
      return res.status(500).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = favouritesRoutes;
