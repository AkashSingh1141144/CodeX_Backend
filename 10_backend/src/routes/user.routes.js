// 📌 Express ke Router ko import kar rahe hain
// Router ek mini-application ki tarah hota hai jisme hum alag-alag routes define kar sakte hain
import { Router } from "express";

// 📌 User Controllers import
// Controllers wo functions hote hain jo actual business logic handle karte hain
// Jaise:
// - Input validation
// - Password hashing
// - Cloudinary image upload
// - Database me save/update/find karna
// - Token generate/send karna
// - Error handling
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken 
} from "../controllers/user.controller.js";

// 📌 Multer middleware import ho raha hai
// Multer form-data me se files (avatar/coverImage) extract karta hai
// Yahi images ko Cloudinary me upload karne ke liye controller ko deta hai
import { upload } from "../middlewares/multer.middleware.js";

// 📌 verifyJWT middleware
// Ye token verify karke user ko authenticate karta hai
// Jo routes secure hone chahiye unme verifyJWT ka use hota hai
import { verifyJWT } from "../middlewares/auth.middleware.js";


// 📌 Ek naya router object banaya
// Isme hum users se related saare routes maintain karenge
const router = Router();


// 🛣  /register route (POST)
// Yaha hum user ka complete registration process handle karte hain
router.route('/register').post(

    // 🧩 Multer middleware — upload.fields()
    // Ye step controller se pehle run hota hai
    // Iska kaam sirf files ko extract karna hota hai
    // Agar form-data me avatar/coverImage aaye to vo yaha se pass honge
    
    upload.fields([
        { 
            // 👇 Field name exact same hona chahiye jo frontend bhejega
            name: 'avatar', 
            // Maximum 1 file allow — single image
            maxCount: 1 
        },
        { 
            name: 'coverImage', 
            maxCount: 1 
        }
    ]),

    // 🔥 Ab multer ke baad controller chalega
    // Controller ko ab ye milta hai:
    // - req.body (normal form inputs)
    // - req.files.avatar
    // - req.files.coverImage
    //
    // registerUser controller me ye kaam hota hai:
    // - Avatar/coverImage Cloudinary me upload
    // - Password hash
    // - User ko DB me save
    // - Tokens generate
    // - Response return
    registerUser
);


// 🛣 /login route (POST)
// User login ke liye:
// - Email check
// - Password verify
// - Access + Refresh token generate
// - Cookies set
router.route("/login").post(loginUser);


// 🛣 /logout route (POST) — PROTECTED ROUTE
// verifyJWT → Pehle token verify karega
// logoutUser → cookies clear, refresh token invalidate
router.route("/logout").post(verifyJWT, logoutUser);


// 🛣 /refresh-token route (POST)
// Refresh token valid hai to naya access token generate hoga
router.route("refresh-token").post(refreshAccessToken);


// 📤 Router ko export kar diya jisse hum ise app.js / index.js me use kar sakein
export default router;
