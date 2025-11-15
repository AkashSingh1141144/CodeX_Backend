class ApiResponse {
	constructor(statusCode, data, message = "success") {
		this.statusCode = statusCode;   
		this.data = data;
		this.message = message;
		this.success = statusCode < 400; // isko chenge kiya hai 08 se
	}
}

export { ApiResponse };


// ApiResponse ka kaam:
// Har API response ko ek clean format me return karna.
// statusCode = HTTP code (200, 400, 500)
// data = actual response data
// message = response message
// success = true jab statusCode < 400 ho
