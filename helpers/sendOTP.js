const nodemailer = require("nodemailer");

module.exports = (email, otp) => {
    // Tạo transporter sử dụng dịch vụ Gmail
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // Cấu hình email
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Xác minh tài khoản bằng OTP",
        html: `Mã OTP của bạn là <b>${otp}</b>`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Email sent: " + info.response);
    });
};
