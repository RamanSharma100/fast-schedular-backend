const mailHelper = require("../utils/mailHelper");
const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");

const verifyEmail = (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ success: false, msg: "Token not found!" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    const { email } = decoded;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, msg: "User Not Found!" });
        }

        // check token expiration
        const currentTime = Date.now() / 1000;
        if (currentTime > user.expireToken) {
          return res
            .status(400)
            .json({ success: false, msg: "Token Expired!" });
        }

        // chekc if user is already verified
        if (user.emailVerified) {
          return res
            .status(400)
            .json({ success: true, msg: "User already verified!" });
        }

        user.emailVerified = true;

        user
          .save()
          .then((user) => {
            res.status(201).json({
              success: true,
              msg: "Email verified successfully!",
              user: { _id: user._id, email: user.email, name: user.name },
            });
          })
          .catch((err) => {
            return res.status(400).json({
              success: false,
              msg: "Something went wrong!",
            });
          });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          msg: "Something went wrong!",
        });
      });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "Invalid Token!" });
  }
};

// send reset password link
const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email not found!" });
  }

  const oldUser = await User.findOne({ email });

  if (!oldUser) {
    return res
      .status(400)
      .json({ success: false, msg: "User not registered!" });
  }

  const token = jsonwebtoken.sign(
    { _id: oldUser._id, email: oldUser.email, name: oldUser.name },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // send reset password link
  const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const message = `
            <h1>Reset Password</h1>
            <p>Please click on the link below to reset your password</p>
            <a href="${link}">${link}</a>
            <br/>
            <p>the token link will expire in </p>
            <p>If you did not request this, please ignore this email</p>
        `;
  try {
    await mailHelper({
      email,
      message,
      subject: "Reset Password",
    });
    res.status(201).json({ success: true, msg: "Reset password link sent!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Something went wrong!" });
  }
};

module.exports = {
  verifyEmail,
  sendResetPasswordLink,
};
