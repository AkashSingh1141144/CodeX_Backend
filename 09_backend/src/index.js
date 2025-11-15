import dotenv from 'dotenv'
import connectedDB from './db/index.js'
import { app } from './app.js'

dotenv.config({path: './.env'})

console.log("Cloudinary API Key Loaded?", process.env.CLOUDINARY_API_KEY);

connectedDB()
.then(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running at port http://localhost:${process.env.PORT}`);
		
	})
})
.catch((error) => {
	console.log(`Database connection failed !!`, error.message);
	process.exit(1);
})  