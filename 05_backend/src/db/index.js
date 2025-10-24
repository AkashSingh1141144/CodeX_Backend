import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";
const databaseConnected =async() => {
	try {
	const connectionInstance =	await mongoose.connect(`${process.env.DATABASE_URI}/${DATABASE_NAME}`)
	console.log(`Server connected successfully!`, connectionInstance.connection.host);
	} catch (error) {
		console.log(`Error on connecting database`, error.message);
		process.exit(1);
	}
}

export default databaseConnected;