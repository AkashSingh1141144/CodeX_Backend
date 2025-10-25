import mongoose from 'mongoose'
import { DATABASE_NAME } from '../constants.js';


const connectDB = async() => {
	try {
	const connectionInstance = 	await mongoose.connect(`${process.env.DATABASE_URI}/${DATABASE_NAME}`)
	console.log(`Database connection successfull !`, connectionInstance.connection.host);
	
	} catch (error) {
		console.log(`Database connection failed !!`, error.message);
		process.exit(1)
	}
}

export default connectDB;