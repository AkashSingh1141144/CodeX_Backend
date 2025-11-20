// 📌 asyncHandler import
// asyncHandler ek wrapper function hota hai jo har async controller ko try/catch ke andar
// automatically run karta hai.
// Agar kisi bhi line me error aayega → ye directly next(error) ko call karega
// → aur tumhara global error handler us error ko handle karlega.
// Iss se har controller me try/catch likhne ki zarurat nahi padti.
import asyncHandler from '../utils/asyncHandler.utils.js';

// 📌 ApiError import
// Custom error class hai → new ApiError(statusCode, message)
// Jisse hum apne tarike se errors throw kar sakte hain (clean and structured).
import { ApiError } from '../utils/ApiError.utils.js';

// 📌 User model import
// Database ke collection ka model (Schema + MongoDB operations)
import { User } from '../models/user.model.js';

// 📌 Cloudinary uploader function import
// Ye function local file ko Cloudinary par upload karta hai aur uska URL wapas deta hai.
import { uploadOnCloudinary } from '../utils/cloudinary.utils.js';

// 📌 ApiResponse class
// Uniform response structure maintain karne ke liye
// new ApiResponse(status, data, message)
import { ApiResponse } from '../utils/ApiResponse.utils.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()


    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return { accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating refresh and access token'
    );
  }
};

// ====================================================================
// 🧠 REGISTER USER CONTROLLER (MAIN FUNCTIONALITY)
// ====================================================================
// asyncHandler() ke andar likhne se try/catch ki zarurat nahi
const registerUser = asyncHandler(async (req, res) => {
  // ------------------------------------------------------------------
  // 📌 STEP 1: FRONTEND SE AANE VALE DATA ACCESS
  // ------------------------------------------------------------------
  // req.body → text fields (username, email, fullName, password)
  // req.files → multer se aayi hui files (avatar, coverImage)
  const { username, email, password, fullName } = req.body;
  console.log('FILES RECEIVED BY MULTER:', req.files);
  //   console.log("email: ", email);
  //   console.log("username: ", username);
  //   console.log("password: ", password);
  //   console.log("fullName: ", fullName);

  // ------------------------------------------------------------------
  // 📌 STEP 2: BASIC VALIDATION — SAB FIELDS FILLED HONA CHAHIYE
  // ------------------------------------------------------------------
  // Yaha hum ensure kar rahe hain ki koi field empty ("") na ho.
  // .trim() se whitespace remove hota hai.
  if (
    [fullName, username, email, password].some((field) => field?.trim() === '')
  ) {
    // Agar koi field empty hai → custom error throw
    throw new ApiError(400, 'All fields are required');
  }

  // ------------------------------------------------------------------
  // 📌 STEP 3: CHECK USER ALREADY EXISTS — USING EMAIL OR USERNAME
  // ------------------------------------------------------------------
  // Mongo query: findOne({ $or: [ {email}, {username} ] })
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  // Agar user mil gaya to new registration allow nahi karna
  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  // ------------------------------------------------------------------
  // 📌 STEP 4: MULTER SE AVATAR + COVER IMAGE KA LOCAL PATH LENA
  // ------------------------------------------------------------------
  // Multer files ko temporary folder me rakhta hai → path property milti hai
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  // TODO: AGAR COVER IMAGE NAHI MILA TOH NULL HOGA
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // Avatar mandatory hai. Agar avatar nahi mila → error
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // ------------------------------------------------------------------
  // 📌 STEP 5: CLOUDINARY PAR IMAGES UPLOAD KARNA
  // ------------------------------------------------------------------
  // uploadOnCloudinary(path) → { url: "..."} return karega
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Agar avatar upload fail ho gaya (rare case) → error
  if (!avatar) {
    throw new ApiError(400, 'Avatar upload required');
  }

  // ------------------------------------------------------------------
  // 📌 STEP 6: USER CREATE KARNA (PASSWORD HASH MODEL ME HOGA)
  // ------------------------------------------------------------------
  // User.create() DB me new document save karega
  const user = await User.create({
    username: username.toLowerCase(), // usernames case-insensitive rakhna best practice
    email,
    password, // hashing schema me ho raha hoga
    fullName,
    avatar: avatar.url, // Cloudinary se returned URL
    coverImage: coverImage?.url || '', // coverImage optional hai
  });

  // ------------------------------------------------------------------
  // 📌 STEP 7: USER KO DOBARA FETCH KARTE HAIN (WITHOUT PASSWORD)
  // ------------------------------------------------------------------
  // .select("-password -refreshToken") → ye fields hata dega
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // Agar kisi reason se create hone ke baad user nahi mila → server error
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  // ------------------------------------------------------------------
  // 📌 STEP 8: SUCCESS RESPONSE SEND KARO
  // ------------------------------------------------------------------
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

// TODO: Making Login User ---------------------------->
const loginUser = asyncHandler(async (req, res) => {
  /* 
      req body se data le aao,
      username or email,
      find the user,
      password check,
      access and refresh token send,
      send to user access and refresh token via cookie
  */

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, 'username or password is required');
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials or password');
  }

  const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)


  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, 
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged In Successfully"
    )
  )
});

//TODO: Logout User
const logoutUser = asyncHandler( async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken",  options)
  .clearCookie("refreshToken", options)
  .json( new ApiResponse(200, {}, "User logged  Out"))
})

// 📤 Controller ko export kar diya jisse route me use ho sake
export {
   registerUser, 
   loginUser,
   logoutUser
  };