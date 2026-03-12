/*
Auth Controller

Handles:
1. Sending Email OTP
2. Verifying Email OTP
3. Creating user after OTP verification

OTP expiry = 2 minutes
*/

const generateOTP = require("../utils/otpGenerator");
const db = require("../config/db");
const sendEmailOTP = require("../services/emailService");


/*
========================================
1️⃣ SEND EMAIL OTP
========================================
*/

exports.sendEmailOTP = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const otp = generateOTP();

    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    // send email
    await sendEmailOTP(email, otp);

    // store otp
    db.query(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?,?,?)",
      [email, otp, expiry],
      (err) => {

        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        res.json({
          message: "OTP sent to email"
        });

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error sending OTP"
    });

  }

};



/*
========================================
2️⃣ VERIFY EMAIL OTP & REGISTER USER
========================================
*/

exports.verifyEmailOTP = (req, res) => {

  const { email, otp, name, mobile, password } = req.body;

  if (!email || !otp) {

    return res.status(400).json({
      message: "Email and OTP required"
    });

  }

  db.query(
    "SELECT * FROM otp_verifications WHERE email=? AND otp=?",
    [email, otp],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (result.length === 0) {

        return res.json({
          message: "Invalid OTP"
        });

      }

      const record = result[0];

      if (new Date() > record.expires_at) {

        return res.json({
          message: "OTP expired"
        });

      }

      // OTP correct → create user

      db.query(
        "INSERT INTO users (name,email,mobile,password) VALUES (?,?,?,?)",
        [name,email,mobile,password],
        (err) => {

          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "User registration failed"
            });
          }

          // delete OTP
          db.query(
            "DELETE FROM otp_verifications WHERE email=?",
            [email]
          );

          res.json({
            message: "Email verified successfully"
          });

        }
      );

    }
  );

};


exports.loginUser = (req,res)=>{

const {identifier,password} = req.body;

if(!identifier || !password){
return res.status(400).json({
message:"All fields required"
});
}

db.query(
"SELECT * FROM users WHERE (email=? OR mobile=?) AND password=?",
[identifier,identifier,password],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({
message:"Database error"
});
}

if(result.length === 0){

return res.json({
message:"Invalid credentials"
});

}

res.json({
message:"Login successful",
user:result[0]
});

}
);

};