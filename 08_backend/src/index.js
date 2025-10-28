import dotenv from 'dotenv'
import connectDB from './db/index.db.js'
import { app } from './app.js'

dotenv.config({path: './.env'})

connectDB()
.then(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running at port: http://localhost:${process.env.PORT}`);
		
	})
})
.catch((error) => {
	console.log('Database connection failed', error.message);
	process.exit(1);
})