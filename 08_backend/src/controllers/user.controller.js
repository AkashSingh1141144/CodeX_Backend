import asyncHandler from '../utils/asyncHandler.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js'

const registerUser  = asyncHandler( async (req, res) => {
	// get user details from frontend
	// validation - not empty
	// check if user already exists: username, email
	// check for images, ckeck for avatar
	// upload them to claudinary, avatar
	// create user object - create entry in db
	// remove password and refresh token field from response 
	// check for user creation { user create hua ya nhi }
	//  return response

	const { fullName, username, email, password } = req.body
	console.log('email', email)

	// if (fullName === "") {
	// 	throw new ApiError(400,  "Full name is required")
	// }

	// if (email === "") {
	// 	throw new ApiError(400,  "Email is required")
	// } 

//	TODO:  upar wala ek ek krke handle krna tha but niche wala jada modern hai 
	if (
		[fullName, email, username, password].some((field) => field.trim() === "username") 
	) {
		throw new ApiError(400, "All fields are required")
	}

	const existedUser =  User.findOne({
		$or: [
			{ email },
			{ username }
		]
	})
	
	if (existedUser) {
		throw new ApiError(409, "User with this email or username already exists")
	}
	const avatarLoacalPath =  req.files?.avatar[0]?.path
	const coverImageLocalPath = req.files?.coverImage[0]?.path

	if (!avatarLoacalPath) {
		throw new ApiError(400, "Avatar is required")
	}

	const avatar = await uploadOnCloudinary(avatarLoacalPath)

	const coverImage = await	uploadOnCloudinary(coverImageLocalPath)

	if (!avatar) {
		throw new ApiError(400, "Avatar upload failed")
	}


	const user = await User.create({
		fullName,
		username: username.toLowerCase(),
		email,
		password,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
	})

	const createdUser =	await User.findById(user._id).select(
		"-password -refreshToken"
	)

	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering the user")
	}


	return res.status(201).json(
		new ApiResponse(200, createdUser, "User registered successfully")
	)
})

export { registerUser }