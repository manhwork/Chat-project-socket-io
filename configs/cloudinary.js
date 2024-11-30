const cloudinary = require("cloudinary").v2;

// Configuration
module.exports = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
    });
};
