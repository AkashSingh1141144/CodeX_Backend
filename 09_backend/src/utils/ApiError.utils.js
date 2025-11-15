class ApiError extends Error {
	constructor (
		statusCode, 
		message = "Something went wrong",
		error = [],
		stack = ""
	) {
		super(message)
		this.statusCode = statusCode
		this.errors = error
		this.data = null
		this.message = message
		this.success = false
		

		if( stack) {
			this.stack = stack
		} else {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}


/**
 * ApiError Class:
 * Backend me custom error banane ke liye use hoti hai.
 * Iska purpose yeh hai ki hum errors ko ek fixed, clean
 * aur structured format me return kar saken.
 *
 * Ye class JavaScript ki default Error class ko extend karti hai,
 * isliye ye normal error ki tarah behave karti hai, bas isme
 * hamare custom fields (statusCode, errors, success, etc.) extra hote hain.
 *
 * Parameters:
 * - statusCode: HTTP error code (e.g., 400, 404, 500)
 * - message: error ka message (default: "Something went wrong")
 * - error: extra error details (mostly array form, optional)
 * - stack: error ka stack trace (debugging ke liye, optional)
 *
 * Important Fields:
 * - this.statusCode → error ka HTTP code store karta hai
 * - this.message → error message store karta hai
 * - this.errors → agar multiple validation errors ho to yaha store hote hain
 * - this.data → error ke case me data hamesha null hota hai
 * - this.success → hamesha false, because this is an error response
 *
 * Stack Handling:
 * Agar user ne custom stack pass kiya ho to same stack use hota hai.
 * Agar nahi dia, to Error.captureStackTrace() se automatic stack generate hota hai,
 * jo batata hai ki error exactly kaha se throw hua.
 *
 * Is class ka use karke:
 * - Backend errors consistent dikhte hai
 * - Frontend ko har error ek proper structured format me milta hai
 * - Debugging easy ho jati hai
 */

export { ApiError }