const express = require("express");
const router = express.Router();
const database = require("../database/database");

router.get("/", async (req, res) => {
  try {
    const users = await database.getUsers();
    res.status(200).send({ success: true, users });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

module.exports = router;
