const express = require("express");
const cors = require("cors");
const app = express();
const portFromConfigs = 3004;

const database = require("./database");

const corsOptions = {
  origin: "http://localhost:5173",
};
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
    res.status(500).send({
      success: false,
      message: "Sorry, we have some problems on server...",
    });
  }
});

app.listen(portFromConfigs, () => {
  console.log(`Listen on port: ${portFromConfigs}`);
});

database.connect();
