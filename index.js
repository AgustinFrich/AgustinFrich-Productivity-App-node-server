//modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

//config
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

//connection
mongoose.connect(process.env.ATLAS_URI);

//routes
require("./src/routes/routes.js")(app);

//listen
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
