import multer from 'multer';

const storage = multer.diskStorage({
	destination: function (req, file, cb) { // cd, callback ka short name hai
		cb(null, ".public/temp") 
	}, 
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

export const upload = multer({
	//storage: storage // isko niche wale style se bhi likh sakte hai
	storage,
})