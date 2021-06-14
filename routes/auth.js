const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// register a user
router.post("/register", async (req, res) => {
  // Let's validate data before we make a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checks if the user is alredy in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already existed ");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    const { password, ...others } = user._doc;
    res.status(200).send(others);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  // Let's validate data before we login  a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checks if the user email is alredy in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  // Checks the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("password is incorrect");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
