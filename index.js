const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// config env
require("dotenv").config();
const port = process.env.PORT;
// End config env

// Cấu hình body-parser để phân tích cú pháp application/json
app.use(bodyParser.json());

// Cấu hình body-parser để phân tích cú pháp application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Config database
const database = require("./configs/database");
database.connect();
// End Config database

// config static file
app.use(express.static("public"));
// end config static file

// config pug engine
app.set("view engine", "pug");
// end config pug engine

// Routers
const Route = require("./routes/index.route");
Route(app);
// End Routers

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
