const express = require("express");
const usersRoutes = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const blacklistModel = require("../models/blacklistModel");

usersRoutes.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .send({
          msg: "User already exists with this email id, Please register again",
        });
    }

    const whiteSpaceRegex = /^\S*$/;
    if (!whiteSpaceRegex.test(firstname)) {
      return res
        .status(500)
        .send({ msg: "White space is not allowed in the First Name" });
    }

    if (!whiteSpaceRegex.test(lastname)) {
      return res
        .status(500)
        .send({ msg: "White space is not allowed in the Last Name" });
    }

    if (!whiteSpaceRegex.test(phone)) {
      return res
        .status(500)
        .send({ msg: "White space is not allowed in the Phone No" });
    }

    const phoneSize = /^[0-9]{10}$/;
    if (!phoneSize.test(phone)) {
      return res.status(500).send({ msg: "Phone no size should be 10 digits" });
    }

    if (!whiteSpaceRegex.test(email.trim())) {
      return res
        .status(500)
        .send({ msg: "White space is not allowed in the Email Address" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([A-Za-z\d@$!%*?&]{8,})$/;
    if (!passwordRegex.test(password)) {
      return res.status(500).send({
        msg: `Please select a new password with minimum 8 alphanumeric and special characters`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
    });

    return res.status(200).send({ msg: "Registered successfull", user });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

usersRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await userModel.findOne({ email });
    if (!userCheck) {
      return res
        .status(401)
        .send({ msg: "User doesn't exist, Please register again" });
    }

    const passwordCheck = await bcrypt.compare(password, userCheck.password);

    if (passwordCheck) {
      const token = jwt.sign({ userID: userCheck._id }, process.env.SECRET_KEY);

      return res.status(200).send({
        msg: "Login successfull",
        token,
        username: `${userCheck.firstname} ${userCheck.lastname}`,
        email: userCheck.email,
      });
    } else {
      return res
        .status(401)
        .send({ msg: "Invaild password, please try again" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

usersRoutes.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;

    if (!token) {
      return res.status(401).send({ msg: "Invaild token, please login again" });
    }

    const blacklistRes = await addToBlacklist(token);

    if (blacklistRes) {
      return res.status(401).send({ error: blacklistRes.error });
    } else {
      return res.status(200).send({ msg: "Logged out successfull" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

const addToBlacklist = async (token) => {
  try {
    const existingBlacklist = await blacklistModel.findOne();

    if (token) {
      const existingToken = await blacklistModel.find({
        blacklist: { $in: token },
      });

      if (existingToken.length) {
        return { error: "User has already logged out" };
      }
    }

    if (existingBlacklist) {
      // If the blacklist document already exists, push the token to the array
      existingBlacklist.blacklist.push(token);
      await existingBlacklist.save();
    } else {
      // If the blacklist document does not exist, create a new one
      await blacklistModel.create({ blacklist: [token] });
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = usersRoutes;
