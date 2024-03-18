const express = require("express");
const router = express.Router();
const database = require("../database/database");
const {
  validateCollectionData,
  validateUpdateCollectionSchema,
} = require("../validator");

router.get("/user-:user_id", async (req, res) => {
  const user = await database.getUser({ id: req.params.user_id });
  if (!user) {
    return res
      .status(404)
      .send({ status: 404, message: "No such userpage exists" });
  }
  const collections = await database.getAllCollections(req.params.user_id);
  res.status(200).send({ status: 200, collections });
});

router.get("/one/:collectionId", async (req, res) => {
  try {
    const collection = await database.getCollection(req.params.collectionId);

    if (!collection) {
      return res
        .status(404)
        .send({ success: false, message: "No such collection!" });
    }

    return res.status(200).send({ success: true, collection });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.post("/many", async (req, res) => {
  try {
    const collections = await database.getManyCollections(req.body.payload);
    return res.status(200).send({ success: true, collections });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.get("/largest", async (req, res) => {
  try {
    const collections = await database.getFiveLargestColls();
    res.status(200).send({ success: true, collections });
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
    const { error = null } = validateCollectionData(req.body.payload);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const newCollection = await database.createCollection(req.body.payload);
    return res.status(200).send({
      success: true,
      message: "New collection was created successfully!",
      newCollection,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

router.put("/updateImageUrl", async (req, res) => {
  try {
    await database.updateImageUrl(req.body.payload);
    res
      .status(200)
      .send({ success: true, message: "Image updated successfully!" });
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
    await database.deleteCollection(req.body.payload);
    return res.status(200).send({
      success: true,
      message: "Collection was deleted successfully!",
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
    const { error = null } = validateUpdateCollectionSchema(
      req.body.payload.newCollection
    );
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    await database.updateCollection(req.body.payload);
    return res
      .status(200)
      .send({ success: true, message: "Collection was updated successfully!" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

module.exports = router;
