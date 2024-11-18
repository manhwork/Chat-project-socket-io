const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");

module.exports = (app) => {
    app.use("/user", userRoutes);

    app.use("/chats", chatRoutes);
};
