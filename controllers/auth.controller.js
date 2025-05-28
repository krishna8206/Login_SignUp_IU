// // const User = require('../models/User');
// // const sendOtp = require('../utils/sendOtp');

// // const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // exports.sendOTP = async (req, res) => {
// //   const { fullName, email, role, vehicleType, vehicleNumber, licenseNumber, agreed } = req.body;

// //   if (!agreed) return res.status(400).json({ message: 'You must agree to terms and conditions.' });

// //   try {
// //     const existingUser = await User.findOne({ email });

// //     if (existingUser && existingUser.verified) {
// //       return res.status(400).json({ message: 'Email is already registered and verified.' });
// //     }

// //     const otp = generateOTP();
// //     await sendOtp(email, otp);

// //     const update = {
// //       fullName,
// //       role,
// //       vehicleType: role === 'Driver' ? vehicleType : '',
// //       vehicleNumber: role === 'Driver' ? vehicleNumber : '',
// //       licenseNumber: role === 'Driver' ? licenseNumber : '',
// //       otp,
// //       verified: false,
// //     };

// //     const user = await User.findOneAndUpdate({ email }, update, { upsert: true, new: true });

// //     res.status(200).json({ message: 'OTP sent to email.' });
// //   } catch (error) {
// //     console.error('Error sending OTP:', error);
// //     res.status(500).json({ message: 'Server error while sending OTP.' });
// //   }
// // };

// // exports.verifyOTP = async (req, res) => {
// //   const { email, otp } = req.body;

// //   try {
// //     const user = await User.findOne({ email });

// //     if (!user || user.otp !== otp) {
// //       return res.status(400).json({ message: 'Invalid or expired OTP.' });
// //     }

// //     user.verified = true;
// //     user.otp = '';
// //     await user.save();

// //     res.status(200).json({ message: 'Account verified successfully.' });
// //   } catch (error) {
// //     console.error('Error verifying OTP:', error);
// //     res.status(500).json({ message: 'Server error while verifying OTP.' });
// //   }
// // };



// const User = require('../models/User');
// const sendOtp = require('../utils/sendOtp');

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // 🔹 Registration - Send OTP
// exports.sendOTP = async (req, res) => {
//   const { fullName, email, role, vehicleType, vehicleNumber, licenseNumber, agreed } = req.body;

//   if (!agreed) return res.status(400).json({ message: 'You must agree to terms and conditions.' });

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser && existingUser.verified) {
//       return res.status(400).json({ message: 'Email is already registered and verified.' });
//     }

//     const otp = generateOTP();
//     await sendOtp(email, otp);

//     const update = {
//       fullName,
//       role,
//       vehicleType: role === 'Driver' ? vehicleType : '',
//       vehicleNumber: role === 'Driver' ? vehicleNumber : '',
//       licenseNumber: role === 'Driver' ? licenseNumber : '',
//       otp,
//       verified: false,
//     };

//     const user = await User.findOneAndUpdate({ email }, update, { upsert: true, new: true });

//     res.status(200).json({ message: 'OTP sent to email.' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ message: 'Server error while sending OTP.' });
//   }
// };

// // 🔹 Login - Send OTP
// exports.sendLoginOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || !user.verified) {
//       return res.status(404).json({ message: 'User not found or not verified.' });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     await user.save();

//     await sendOtp(email, otp);

//     res.status(200).json({ message: 'OTP sent to email.' });
//   } catch (error) {
//     console.error('Error sending login OTP:', error);
//     res.status(500).json({ message: 'Server error while sending OTP.' });
//   }
// };

// // 🔹 Common - Verify OTP (for both registration and login)
// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid or expired OTP.' });
//     }

//     user.verified = true;
//     user.otp = '';
//     await user.save();

//     res.status(200).json({ message: 'Account verified successfully.' });
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ message: 'Server error while verifying OTP.' });
//   }
// };


const User = require('../models/User');
const sendOtp = require('../utils/sendOtp');
const generateToken = require('../utils/generateToken');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Registration - Send OTP
exports.sendOTP = async (req, res) => {
  const { fullName, email, phone, role, vehicleType, vehicleNumber, licenseNumber, agreed } = req.body;

  if (!agreed) return res.status(400).json({ message: 'You must agree to terms and conditions.' });

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }

    const otp = generateOTP();
    await sendOtp(email, otp);

    const update = {
      fullName,
      role,
      phone,
      vehicleType: role === 'Driver' ? vehicleType : '',
      vehicleNumber: role === 'Driver' ? vehicleNumber : '',
      licenseNumber: role === 'Driver' ? licenseNumber : '',
      otp,
      verified: false,
    };

    const user = await User.findOneAndUpdate({ email }, update, { upsert: true, new: true });

    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
};

// 🔹 Login - Send OTP
exports.sendLoginOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return res.status(404).json({ message: 'User not found or not verified.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
};

// 🔹 Common - Verify OTP (for both registration and login)
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.verified = true;
    user.otp = '';
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: 'Account verified successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
};
