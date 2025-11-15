// 📌 Express ke Router ko import kar rahe hain
// Router ek mini-application ki tarah hota hai jisme hum alag-alag routes define kar sakte hain
import { Router } from "express";

// 📌 registerUser controller import kar rahe hain
// Controller wo function hota hai jo actual logic handle karta hai
// Jaise: validation, DB me save karna, cloudinary upload, error throw, response send karna etc.
import { registerUser } from "../controllers/user.controller.js";

// 📌 Multer middleware import ho raha hai
// Multer ka kaam hota hai incoming form-data me se files ko extract karna
// Yahi middleware avatar aur coverImage ki files ko handle karega
import { upload } from "../middlewares/multer.middleware.js";


// 📌 Ek naya router object banaya
// Is router me hum users se related routes maintain karenge
const router = Router();


// 🛣  /register route (POST)
// Yaha hum user ke registration ka complete flow handle karenge
router.route('/register').post(

	// 🧩 Multer middleware — upload.fields()
	// Jab user form submit karega aur usme avatar ya coverImage file hogi
	// To sabse pehle ye middleware run hoga BEFORE controller

	// upload.fields() ka matlab hai hum multiple file fields allow kar rahe hain
	// Har field ka naam hona chahiye:
	//  - avatar: ek file
	//  - coverImage: ek file
	upload.fields([
		{ 
			// 👇 Field ka exact name jaisa frontend bhejega
			name: 'avatar', 
			// Maximum 1 file allowed
			maxCount: 1 
		},
		{ 
			name: 'coverImage', 
			maxCount: 1 
		}
	]),

	// 🧠 Multer ke baad controller run hota hai
	// registerUser ko ab req.body + req.files dono milenge
	//  req.files.avatar → actual avatar file
	//  req.files.coverImage → actual cover image file
	// Controller yaha:
	// - files ko Cloudinary me upload karega
	// - password hash karega
	// - DB me user create karega
	// - sahi response bhejega
	registerUser
);


// 📤 Router ko export kar diya jisse hum ise app.js / index.js me use kar sakein
export default router;

