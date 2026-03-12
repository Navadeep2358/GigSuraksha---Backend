const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});
const sendEmailOTP = async (email, otp) => {

  try {

    const mailOptions = {

      from: `"GigSuraksha Security" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "GigSuraksha Email Verification OTP",

      html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px">

        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08)">

          <!-- HEADER -->

          <div style="background:#2563eb; padding:20px; text-align:center">

            <h1 style="color:white; margin:0">GigSuraksha</h1>
            <p style="color:#dbeafe; margin:5px 0 0">
              Protecting Gig Workers with Smart Risk Monitoring
            </p>

          </div>

          <!-- BODY -->

          <div style="padding:30px">

            <h2 style="margin-top:0">Email Verification</h2>

            <p>
              Hello,
            </p>

            <p>
              Thank you for registering with <b>GigSuraksha</b>.
              To complete your account setup, please use the following
              One-Time Password (OTP) to verify your email address.
            </p>

            <!-- OTP BOX -->

            <div style="
              text-align:center;
              margin:30px 0;
            ">

              <span style="
                font-size:32px;
                letter-spacing:8px;
                font-weight:bold;
                background:#eef2ff;
                padding:15px 25px;
                border-radius:8px;
                display:inline-block;
                color:#2563eb
              ">
                ${otp}
              </span>

            </div>

            <p>
              This OTP will expire in <b>2 minutes</b>.
            </p>

            <p>
              If you did not request this verification, please ignore this email.
              Your account will remain secure.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0">

            <p style="font-size:13px;color:#666">
              GigSuraksha helps protect gig workers from unexpected income loss
              due to weather conditions by using intelligent risk monitoring.
            </p>

          </div>

          <!-- FOOTER -->

          <div style="background:#f8fafc; padding:15px; text-align:center">

            <p style="font-size:12px;color:#888;margin:0">
              © ${new Date().getFullYear()} GigSuraksha. All rights reserved.
            </p>

          </div>

        </div>

      </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully");

  } catch (error) {

    console.log("Email sending failed:", error);

  }

};

module.exports = sendEmailOTP;