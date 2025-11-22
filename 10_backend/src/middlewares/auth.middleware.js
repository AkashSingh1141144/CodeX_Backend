// 📌 User model import
// Database me stored user ki information yahi model se fetch/verify hoti hai
import { User } from '../models/user.model.js';

// 📌 Custom Error Class import
// ApiError ka use hum proper status code + message ke sath error throw karne ke liye karte hain
import { ApiError } from '../utils/ApiError.utils.js';

// 📌 asyncHandler
// async functions me try/catch avoid karne ke liye wrapper hota hai
// Agar koi async error aaye to automatically next(error) me chala jata hai
import asyncHandler from '../utils/asyncHandler.utils.js';

// 📌 JWT library
// Token ko verify, decode karne ke liye use hoti hai
import jwt from 'jsonwebtoken';

// 📌 verifyJWT Middleware
// Iska kaam:
// 1. Token extract karna (cookie ya Authorization header se)
// 2. Token decode/verify karna
// 3. User ko DB se fetch karna (token ke andar jo _id hai usse)
// 4. User ko req.user me set karna
// 5. Agar kuch galat ho to 401 Unauthorized throw karna

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 🔍 STEP 1: Token extract karna
    // Hum 2 jagah check karte hain:
    // 1. req.cookies.accessToken → jab frontend cookie me token bhejta hai
    // 2. Authorization header → "Bearer tokenValue"
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    // ❌ Agar token hi nahi mila to unauthorized
    if (!token) {
      throw new ApiError(401, 'Unauthorized request – Token not found');
    }

    // 🔍 STEP 2: Token verify karna
    // jwt.verify token ko decode karta hai aur sath me secret validate karta hai
    // Agar secret match nahi hua ya token expired hua to error throw hota hai
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // decodedToken me user ka _id hota hai
    // Example:
    // {
    //    _id: "659a45acb...",
    //    iat: 1712347288,
    //    exp: 1712350888
    // }

    // 🔍 STEP 3: DB se user find karna
    // Kyun? Kyunki token purana bhi ho sakta hai, user delete bhi ho sakta hai
    // .select("-password -refreshToken") → in fields ko hide kar diya
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    // ❌ Agar token genuine hai par user nahi mil raha to invalid token
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token – User not found');
    }

    // 🔥 STEP 4: User ko request object me set karna
    // Jisse next middleware aur controllers user ki info use kar sake
    req.user = user;

    // 👍 Sab kuch sahi → Next middleware/controller ko allow kar do
    next();
  } catch (error) {
    // ❌ Agar kahin bhi error aya to 401 Unauthorized
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
