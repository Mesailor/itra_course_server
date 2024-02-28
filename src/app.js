const express = require("express");
const cors = require("cors");
const app = express();
const portFromConfigs = 3004;

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.post("/auth", (req, res) => {});

app.post("/signup", (req, res) => {});

app.listen(portFromConfigs, () => {
  console.log(`Listen on port: ${portFromConfigs}`);
});
