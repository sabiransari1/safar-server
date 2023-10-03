const express = require("express");
const placesRoutes = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const homeModel = require("../models/homeModel");
const placeModel = require("../models/placeModel");

placesRoutes.get("/gethomeplaces", async (req, res) => {
  try {
    const places = await homeModel.find();

    return res.status(200).send(places);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

placesRoutes.get("/getplaces", async (req, res) => {
  try {
    const { title, pageno, pagelimit, sortbyprice, type } = req.query;
    const query = new Object();
    if (title || type) {
      query.title = RegExp(title, "i");
      query.type = RegExp(type, "i");
    }
    const toSkip = pageno * pagelimit - pagelimit;
    let sortOrder = null;
    let sortBy = null;

    if (sortbyprice) {
      sortBy = "price";
    }

    if (sortbyprice === "asc") {
      sortOrder = 1;
    } else if (sortbyprice === "desc") {
      sortOrder = -1;
    }

    const places = await placeModel
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(toSkip)
      .limit(pagelimit);

    return res.status(200).send(places);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

placesRoutes.get("/getplace/:placeID", async (req, res) => {
  try {
    const placeID = req.params.placeID;

    const place = await placeModel.findById(placeID);

    return res.status(200).send(place);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

placesRoutes.use(authMiddleware);

placesRoutes.post("/addplace", async (req, res) => {
  try {
    const existingUserID = req.body.userID;

    const place = await placeModel.create({
      ...req.body,
      userID: existingUserID,
    });

    place.populate();
    return res
      .status(200)
      .send({ msg: "Place has been added successfully", place });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

placesRoutes.patch("/update/:placeID", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const placeID = req.params.placeID;

    const place = await placeModel.findById(placeID);

    if (place.userID.toString() == existingUserID) {
      const updatedPlace = await placeModel.findByIdAndUpdate(
        placeID,
        req.body,
        {
          new: true,
        }
      );
      return res
        .status(200)
        .send({ msg: "Place has been updated successfully", updatedPlace });
    } else {
      return res.status(500).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

placesRoutes.delete("/delete/:placeID", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const placeID = req.params.placeID;

    const place = await placeModel.findById(placeID);

    if (place.userID.toString() === existingUserID) {
      const deletedplace = await placeModel.findByIdAndDelete(placeID);
      return res
        .status(200)
        .send({ msg: "Place has been deleted successfully", deletedplace });
    } else {
      return res.status(500).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = placesRoutes;
