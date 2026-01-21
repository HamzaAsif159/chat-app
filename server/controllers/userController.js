import bcrypt from "bcrypt";
import User from "../models/UserModal.js";

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, email, password, image } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (image) user.image = image;

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({ message: "Profile updated", user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
