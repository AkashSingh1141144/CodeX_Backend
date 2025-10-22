import mongoose from "mongoose";		
import { Database_Name } from "../constants.js";

const databaseConnected = async() => {
	try {
		const conectionOnInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${Database_Name}`)
		console.log(`Database connected successfully! ${conectionOnInstance.connection.host}`);
		
	} catch (error) {
		console.log(`MongoDB Database is not connected!`, error.message);
		process.exite(1);
	}
}


export default databaseConnected;