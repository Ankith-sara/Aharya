import nodemailer from 'nodemailer';

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,        // your Gmail address
      pass: process.env.EMAIL_PASS,        // your App Password (not your Gmail password)
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP',
    html: `<h2>Your OTP is: ${otp}</h2><p>It is valid for 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};
