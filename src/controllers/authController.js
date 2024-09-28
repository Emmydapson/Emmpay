import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail, validatePassword } from '../utils/authUtils.js';
import {
  registerSchema,
  otpSchema,
  loginSchema,
  pinSchema,
  kycSchema,
} from '../middlewares/authValidation.js';
import { verifyKYC } from '../services/zenithServices.js';

// Registration Controller
export const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { firstName, surname, email, phone, gender, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      firstName,
      surname,
      email,
      phone,
      gender,
      password: await bcrypt.hash(password, 10),
    });

    // Generate and send OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await sendOTPEmail(email, otp);
    await user.save();

    res
      .status(201)
      .json({ message: 'Registration successful, verify OTP sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// OTP Verification Controller
export const verifyOTP = async (req, res) => {
  const { error } = otpSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Resend OTP Controller
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate and send a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await sendOTPEmail(email, otp);
    await user.save();

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create PIN Controller
export const createPin = async (req, res) => {
  const { error } = pinSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { pin } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.pin = await bcrypt.hash(pin, 10);
    await user.save();

    res.status(200).json({ message: 'PIN created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// KYC Controller
export const submitKYC = async (req, res) => {
  const { error } = kycSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { idType, idNumber } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Call the Zenith Bank KYC verification service
    const kycDocument = { idType, idNumber };
    const kycResult = await verifyKYC(userId, kycDocument);

    if (kycResult.success) {
      // Store the KYC result in the user's profile
      user.kyc = { idType, idNumber, status: 'Verified' };
      await user.save();

      return res.status(200).json({ message: 'KYC verification successful' });
    } else {
      return res.status(400).json({ message: 'KYC verification failed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
