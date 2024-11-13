const mongoose = require("mongoose");
module.exports.connect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connect success");
    } catch (error) {
        console.log("DB connect fail");
    }
};
