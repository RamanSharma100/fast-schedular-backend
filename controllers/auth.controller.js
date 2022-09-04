const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const mailHelper = require("../utils/mailHelper");

const { getLocation } = require("../utils/methods");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields!" });
  }

  // check if user exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Email or Password!!" });
      }

      // check if password is correct
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, msg: "Invalid Email or Password!" });
        }

        // create and assign a token
        const token = jsonwebtoken.sign(
          { _id: user._id, email: user.email, name: user.name },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.status(201).json({
          success: true,
          token,
          user: { _id: user._id, email: user.email, name: user.name },
          msg: "Logged in successfully!",
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, msg: err.message });
    });
};

const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields!" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, msg: "User already exists!" });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //   create new user
  const user = new User({
    email,
    password: hashedPassword,
    name,
  });

  user.save().then((user) => {
    // send email for verification

    const tokenMail = jsonwebtoken.sign(
      { _id: user._id, email: user.email, name: user.name },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const url = `${process.env.CLIENT_URL}/verify/${tokenMail}`;
    const message = `
        <h1>Verify your email address</h1>
        <p>Please click the button below to verify your email address</p>
        <a href=${url} clicktracking=off>${url}</a>
        <br/>
        <p>This link is valid for 1 day</p>
        <p>If you did not create an account, please ignore this email</p>

        `;
    mailHelper({
      email: user.email,
      subject: "Verify your email address",
      message,
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          msg: "you are registered successfully! please login to continue",
        });
      })
      .catch((err) => {
        return res.status(400).json({ success: false, msg: err.message });
      });
  });
};

const resetPassword = async (req, res) => {
  const { password, confirmPassword, userId } = req.body;

  // get bearere token
  const token = req.header("Authorization").replace("Bearer ", "");

  // check token is there or not
  if (!token) {
    return res.status(401).json({ success: false, msg: "Access denied!" });
  }

  // verify token
  const decoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

  // check token is valid

  if (!decoded) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }

  // chceck token is expired

  if (decoded.exp < Date.now() / 1000) {
    return res.status(401).json({ success: false, msg: "Token expired" });
  }

  // check if user exists
  const user = await User.findOne({ _id: decoded._id });

  if (!user) {
    return res.status(400).json({ success: false, msg: "User does not exist" });
  }

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields!" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, msg: "Passwords do not match!" });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  User.updateOne({ _id: userId }, { $set: { password: hashedPassword } })
    .then((user) => {
      res
        .status(201)
        .json({ success: true, msg: "Password updated successfully!" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, msg: "something went wrong!" });
    });
};

module.exports = {
  login,
  register,
  resetPassword,
};
