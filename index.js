const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connection = require("./db");
const usersRoutes = require("./routes/usersRoutes");
const placesRoutes = require("./routes/placesRoutes");
const favouritesRoutes = require("./routes/favouritesRoutes");

app.use(express.json());
app.use(express.text());
app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).send("Safar Homepage...");
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

app.use("/users", usersRoutes);
app.use("/places", placesRoutes);
app.use("/favourites", favouritesRoutes);

app.listen(process.env.PORT || 7070, () => {
  try {
    connection();

    console.log(`Server is runing on port ${process.env.PORT || 7070}...`);
  } catch (error) {
    console.log({ error: error.message });
  }
});
