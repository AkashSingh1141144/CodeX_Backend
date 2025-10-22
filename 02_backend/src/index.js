import dotenv from "dotenv";
import databaseConnected from "./db/index.js";

dotenv.config();




databaseConnected()
.then(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running at port:${process.env.PORT}`);
	})
})
.catch((error) => {
	console.log(`Database connection failed !!!`, error);
	
})