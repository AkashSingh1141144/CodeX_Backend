import mongoose from "mongoose"
import { DATABASE_NAME } from "../constants.js";


const databaseConnected = async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DATABASE_NAME}`)
		console.log(`Database connected succefull !`, connectionInstance.connection.host);
		
	} catch (error) {
		console.log(`Database connection failed !!!`, error.massage);
		process.exit(1);
	}
}

export { databaseConnected }