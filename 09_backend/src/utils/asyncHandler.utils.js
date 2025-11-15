const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error));
    }
}

export default asyncHandler;

// asyncHandler ka kaam:
// Ye har async function ko try/catch ke bina safely chalata hai.
// Agar route me koi error aata hai to wo automatic next(error) me bhej deta hai.
// Isse server crash nahi hota aur code clean rehta hai.
