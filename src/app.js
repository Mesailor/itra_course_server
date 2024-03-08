const express = require("express");
const cors = require("cors");
const config = require("config");
const bcrypt = require("bcrypt");
const app = express();

const database = require("./database");
const {
  validateUserData,
  validateCollectionData,
  validateUpdateCollectionSchema,
} = require("./validator");

const { port, corsOptions } = config.get("serverConfig");

app.use(cors(corsOptions));
app.use(express.json());

app.post("/auth", async (req, res) => {
  const credentials = req.body;
  try {
    const user = await database.getUser(credentials.name);
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

app.post("/signup", async (req, res) => {
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
        message: "Sorry, user with this name already exist!",
      });
    }
    res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

app.get("/collections/:user_id", async (req, res) => {
  const collections = await database.getOwnCollections(req.params.user_id);
  res.status(200).send(collections);
});

app.post("/collections/create", async (req, res) => {
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

app.put("/collections/updateImageUrl", async (req, res) => {
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

app.delete("/collections/delete", async (req, res) => {
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

app.put("/collections/update", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});

database.connect();
