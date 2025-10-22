import dotenv from "dotenv"
import { databaseConnected } from "./db/index.js";
import app from "./app.js"

dotenv.config({path: './.env'});


databaseConnected()
.then(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running at port:${process.env.PORT}`);
	})
})
.catch((error) => {
	console.log(`Dabase connection loset !`, error.message);
	
})