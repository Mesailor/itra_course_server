const express = require("express");
const router = express.Router();
const database = require("../database");
const bcrypt = require("bcrypt");
const { validateUserData } = require("../validator");

router.post("/", async (req, res) => {
  const credentials = req.body;
  try {
    const user = await database.getUser({ name: credentials.name });
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      return res
        .status(400)
        .send({ success: false, message: "Wrong name or password!" });
    }

    res.status(200).send({
      success: true,
      message: "User authenticated successfully!",
      user: { ...user.dataValues, password: null },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { error = null } = validateUserData(req.body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const newUser = await database.createUser(req.body);
    res.status(200).send({
      success: true,
      user: { ...newUser.dataValues, password: null },
      message: "New user was created successfully!",
    });
  } catch (e) {
    console.log(e);
    if (e.errors[0].type === "unique violation") {
      return res.status(400).send({
        success: false,
        message: "Sorry, a user with the same name already exists!",
      });
    }
    res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

module.exports = router;
