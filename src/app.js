const express = require("express");
const cors = require("cors");
const config = require("config");
const app = express();

const { port, corsOptions } = config.get("serverConfig");

const database = require("./database");

app.use(cors(corsOptions));
app.use(express.json());

app.post("/auth", async (req, res) => {
  try {
    const credentials = req.body;
    const user = await database.getUser(credentials.name);
    if (!user || user.password !== credentials.password) {
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

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});

database.connect();
