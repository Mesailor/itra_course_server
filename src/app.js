const express = require("express");
const cors = require("cors");
const config = require("config");
const app = express();
const accountRouter = require("./routes/account");
const collectionsRouter = require("./routes/collections");
const itemsRouter = require("./routes/items");

const database = require("./database");

const { port, corsOptions } = config.get("serverConfig");

app.use(cors(corsOptions));
app.use(express.json());

app.use("/account", accountRouter);
app.use("/collections", collectionsRouter);
app.use("/items", itemsRouter);

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});

database.connect();
