// [GET] /chat/
module.exports.index = async (req, res) => {
    res.render("../views/pages/chat/index.pug");
};
