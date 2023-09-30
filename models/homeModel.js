const mongoose = require("mongoose");

const homePlaceSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const homePlaceModel = mongoose.model("homeplaces", homePlaceSchema);

module.exports = homePlaceModel;
