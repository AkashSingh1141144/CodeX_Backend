import mongoose  from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectedDB = async () => {
	try {
	const connectionInstance =	await mongoose.connect(`${process.env.DATABASE_URI}/${DATABASE_NAME}`)
	console.log(`Database Connected Succesfully`, connectionInstance.connection.host);
	
	} catch (error) {
		console.log(`Database not Connected `, error.message);
		process.exit(1);
	}
}

export default connectedDB;