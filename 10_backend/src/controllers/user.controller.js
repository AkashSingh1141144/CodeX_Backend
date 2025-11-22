// ====================================================================
// 📌 asyncHandler
// ====================================================================
// asyncHandler ek wrapper helper function hota hai jo har async function
// ko try/catch ke andar automatically wrap karta hai.
// → Isse har controller me try/catch likhne ki zarurat nahi hoti.
// → Agar koi bhi error aata hai to ye next(error) call kar deta hai
//   jisse tumhara global error handler us error ko handle karta hai.
import asyncHandler from '../utils/asyncHandler.utils.js';


// ====================================================================
// 📌 ApiError (Custom Error Class)
// ====================================================================
// new ApiError(statusCode, message)
// → Isse hum apne custom error clean format me throw kar sakte hain.
// → Iska fayda → har error ek standard format me jata hai.
import { ApiError } from '../utils/ApiError.utils.js';


// ====================================================================
// 📌 User Model (MongoDB + Mongoose schema)
// ====================================================================
// Ye tumhare users collection ka schema + model represent karta hai.
// Sare database related kaam Yahi se honge.
import { User } from '../models/user.model.js';


// ====================================================================
// 📌 Cloudinary Upload Utility
// ====================================================================
// Ye function koi bhi file Cloudinary par upload karta hai
// Aur uska secure URL return karta hai.
// uploadOnCloudinary("local/path") → { url: "...cloudinary-link..." }
import { uploadOnCloudinary } from '../utils/cloudinary.utils.js';


// ====================================================================
// 📌 ApiResponse (Custom Success Response Format)
// ====================================================================
// new ApiResponse(statusCode, data, message)
// → Sab responses ek jaisa structure maintain karte hain.
import { ApiResponse } from '../utils/ApiResponse.utils.js';


// ====================================================================
// 📌 JSON Web Token Library Import
// ====================================================================
import jwt from 'jsonwebtoken';



// ====================================================================
// 📌 Generate Access Token & Refresh Token Function
// ====================================================================
// ⚠️ Ye function LOGIN ke time tokens generate karne ke liye use hota hai.
// 1. User find hoga
// 2. User model ke methods se token generate honge
// 3. Refresh token DB me store hoga
// 4. Dono tokens return honge
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Step 1: User ko DB me find karo
    const user = await User.findById(userId);

    // Step 2: Model methods se JWT tokens banao
    const accessToken = user.generateAccessToken();       // Short life token
    const refreshToken = user.generateRefreshToken();     // Long life token

    // Step 3: Refresh token ko DB me save karo
    user.refreshToken = refreshToken;

    // validateBeforeSave:false → Mongo validations skip ho jaate hain
    await user.save({ validateBeforeSave: false });

    // Step 4: Tokens return
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating refresh and access token'
    );
  }
};



// ====================================================================
// 🧠 CONTROLLER #1 — REGISTER USER
// ====================================================================
const registerUser = asyncHandler(async (req, res) => {

  // STEP 1: Client se incoming data
  const { username, email, password, fullName } = req.body;

  console.log('FILES RECEIVED BY MULTER:', req.files);

  // STEP 2: Validation — koi field empty nahi honi chahiye
  if ([fullName, username, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  // STEP 3: Check existing user (email OR username)
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  // STEP 4: Avatar (required file) and optional cover image
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // STEP 5: Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar upload failed');
  }

  // STEP 6: Create user (password hash model me hoga)
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
  });

  // STEP 7: User w/o sensitive fields fetch
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  // STEP 8: Final success response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});



// ====================================================================
// 🧠 CONTROLLER #2 — LOGIN USER
// ====================================================================
const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = req.body;

  // STEP 1: Username OR Email required
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // STEP 2: Find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  // STEP 3: Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials or password');
  }

  // STEP 4: Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  // STEP 5: Remove sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // STEP 6: Cookie options
  // httpOnly → JS code access nahi kar sakta (security)
  // secure → only HTTPS par work karega
  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log(`🎉 User Logged In Successfully: ${loggedInUser.username}`);

  // STEP 7: Send cookies + response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});



// ====================================================================
// 🧠 CONTROLLER #3 — LOGOUT USER
// ====================================================================
const logoutUser = asyncHandler(async (req, res) => {

  // Step 1: Logged-in user ka refresh token DB se delete
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  // Step 2: Cookie removal options
  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log(`🎉 User Logged Out Successfully!`);

  // Step 3: Token cookies clear
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});



// ====================================================================
// 🧠 CONTROLLER #4 — REFRESH ACCESS TOKEN
// ====================================================================
const refreshAccessToken = asyncHandler(async (req, res) => {

  // Step 1: Client ke cookie/body se token lo
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // Step 2: Refresh token required
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  } // TODO: agar error hai to ! hata do 

  try {
    // Step 3: Validate/Decode token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Step 4: User find
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Step 5: Compare refresh tokens
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }

    // Step 6: New tokens generate
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    }; // TODO: AGAR ERROR AAYA TO OPTIONS KO UPAR OR CONST KO NICHE

    // Step 7: Set cookies
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed"
        )
      );

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});



// ====================================================================
// 📤 EXPORT ALL CONTROLLERS
// ====================================================================
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
