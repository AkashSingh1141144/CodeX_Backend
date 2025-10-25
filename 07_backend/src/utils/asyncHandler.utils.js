const asyncHandler = (requestHandler) => {
	return (req, res, next) => { // previose code me yaha pe return nhi lga tha (debbuging)
		Promise.resolve(requestHandler(req, res, next).catch((error) => next(error)))
	}
}

export default asyncHandler 