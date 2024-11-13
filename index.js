const express = require("express");
const app = express();

// config env
require("dotenv").config();
const port = process.env.PORT;

// End config env

// Config database
const database = require("./configs/database");
database.connect();
// End Config database

// Routers
const Route = require("./routes/index.route");
Route(app);
// End Routers

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
