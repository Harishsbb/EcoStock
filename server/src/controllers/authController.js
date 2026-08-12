import User from "../models/User.js";
import Shop from "../models/Shop.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "smartstock_super_secret_jwt_key_2026_prod", {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, shopName, email, phone, password } = req.body;

    if (!name || !email || !password || !shopName) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create Shop first
    const shop = await Shop.create({
      name: shopName,
      phone,
      address: "Main Commercial Street, City Center",
    });

    // Create Owner User
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "OWNER",
      shopId: shop._id,
    });

    shop.ownerId = user._id;
    await shop.save();

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      shop: {
        _id: shop._id,
        name: shop.name,
        address: shop.address,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).populate("shopId");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      shop: user.shopId
        ? {
            _id: user.shopId._id,
            name: user.shopId.name,
            address: user.shopId.address,
          }
        : null,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("shopId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
