import mongoose from 'mongoose'
import { DATABASE_NAME } from '../constants.js';

const databaseconnection = async() => {
	try {
	const connectionInstance =	await mongoose.connect(`${process.env.DATABASE_URI}/${DATABASE_NAME}`)
	console.log('Database Connection successfull !', connectionInstance.connection.host);
	
	} catch (error) {
		console.log('Database is not connected  !', error.message);
		process.exit(1)
	}
}


export default databaseconnection;