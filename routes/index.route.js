const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");

const authRequiredMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.get("/", async (req, res) => {
        res.redirect("/user/login");
    });

    app.use("/user", userRoutes);

    app.use("/chats", authRequiredMiddleware.authRequired, chatRoutes);
};
