const cloudinary = require("cloudinary").v2;

// Configuration
module.exports = () => {
    cloudinary.config({
        cloud_name: "dc64wxcp6",
        api_key: "837852319962278",
        api_secret: "ioYYY5vkVQBqKAFN4zZSUYmal3U", // Click 'View API Keys' above to copy your API secret
    });
};
