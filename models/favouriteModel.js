const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    availability: { type: String, required: true },
    price: { type: Number, required: true },
    review: { type: Number, required: true },
    rating: { type: Number, required: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const favouriteModel = mongoose.model("favourites", favouriteSchema);

module.exports = favouriteModel;
