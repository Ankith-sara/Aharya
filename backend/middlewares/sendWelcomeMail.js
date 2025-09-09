import nodemailer from 'nodemailer';

const sendWelcomeMail = async (email, name = 'User') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider (use Mailgun/SendGrid in production)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Aharyas!`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>Hi ${name},</h2>
        <p>Thank you for registering with <strong>Aharyas</strong>.</p>
        <p>We're thrilled to have you on board.</p>
        <br/>
        <p>Warm regards,<br/>The Aharyas Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendWelcomeMail;