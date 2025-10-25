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
		this.stack = stack

		if( stack) {
			this.stack = stack
		} else {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}