const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const configureCloudinary = require("../configs/cloudinary");

configureCloudinary();

const upload = multer();

module.exports.Upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new Error("No file uploaded"));
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        // Tạo url với ảnh được tối ưu hóa
        const imageUrl = cloudinary.url(result.public_id, {
            transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        });

        // thêm trường của ảnh vào req.body
        req.body[req.file.fieldname] = imageUrl;
        console.log(imageUrl);

        // console.log(result);
        next();
    } catch (error) {
        next();
    }
};
