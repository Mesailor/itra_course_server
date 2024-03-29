const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const router = express.Router();
const database = require("../database/database");
const { validateNewItem, validateUpdatedItem } = require("../validator");

async function validateJwt(req, res, next) {
  const jwtSecret = config.get("jwtSecret");
  try {
    const decoded = jwt.verify(req.body.token, jwtSecret);

    const { itemId, collection_id } = req.body.payload;

    if (itemId) {
      const item = await database.getItem(itemId);
      const collecion = await database.getCollection(item.collection_id);
      if (collecion.user_id !== decoded.id && decoded.isAdmin !== true) {
        return res
          .status(401)
          .send({ success: false, message: "User unauthorized" });
      }
      return next();
    }

    if (collection_id) {
      const collecion = await database.getCollection(collection_id);
      if (collecion.user_id !== decoded.id && decoded.isAdmin !== true) {
        return res
          .status(401)
          .send({ success: false, message: "User unauthorized" });
      }
      return next();
    }

    res.status(404).send({
      success: false,
      message: "JWT check failed. Invalid payload was send.",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send({ success: false, message: "Invalid token was sent" });
  }
}

router.use("/create", validateJwt);
router.use("/delete", validateJwt);
router.use("/update", validateJwt);

router.get("/:collectionId", async (req, res) => {
  try {
    const collection = await database.getCollection(req.params.collectionId);
    if (!collection) {
      return res
        .status(404)
        .send({ success: false, message: "No such collection!" });
    }
    const items = await database.getItems(req.params.collectionId);
    return res.status(200).send({ success: true, items });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.get("/one/:itemId", async (req, res) => {
  try {
    const item = await database.getItem(req.params.itemId);
    res.status(200).send({ success: true, item });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { error } = validateNewItem(req.body.payload);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const newItem = await database.createItem(req.body.payload);
    return res.status(200).send({
      success: true,
      message: "New item was created successfully!",
      newItem,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    await database.deleteItem(req.body.payload.itemId);
    return res.status(200).send({
      success: true,
      message: "Item was deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { error } = validateUpdatedItem(req.body.payload.newItem);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    await database.updateItem(req.body.payload);
    return res
      .status(200)
      .send({ success: true, message: "Item was updated successfully!" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

module.exports = router;
