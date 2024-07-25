const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const NotesUser = mongoose.model("NotesUsers", {
  username: String,
  email: String,
  password: String,
});

async function registerUser(userName, email, password) {
  // Number of salt rounds
  const saltRounds = 10;
  console.log(password);
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);

  // Create a new user
  const user = await new NotesUser({
    username: userName,
    email,
    password: hashedPassword,
  }).save();

  // Return the new user
  return user;
}

async function loginUser(username, password) {
  // Find the user by email address
  const user = await NotesUser.findOne({ username });

  // If the user is not found, return null
  if (!user) {
    return null;
  }

  // Compare the passwords - the user submitted one and the hashed/stored one.
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  // If the password is incorrect, return null
  if (!isPasswordCorrect) {
    return null;
  }

  // Return the user
  return user;
}

module.exports = {
  registerUser,
  loginUser,
};
