// controllers/authController.js

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// User Registration (Sign Up)
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName);

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: 'Adresse e-mail déjà utilisée' });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user in the database
    await user.save();

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error registering user' });
  }
};

// User Login (Sign In)
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });


    if (!user) {
      return res.json({ success: false, message: 'Adresse e-mail non enregistrée' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Return success response with token
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);  // Log error for debugging
    return res.status(500).json({ success: false, message: 'Error logging in' });
  }
};

const adminSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error logging in' });
  }
};


// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

module.exports = { signUp, signIn, adminSignIn, getUsers };
