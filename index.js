const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = createServer(app);

// socket io

const io = new Server(server);
global._io = io;

// socket io

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
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
