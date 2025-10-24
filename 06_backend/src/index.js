import dotenv, { config } from 'dotenv'
import databaseconnection from './db/index.js'
import { app } from './app.js'

dotenv.config({
	path: "./.env"
})

databaseconnection()
.then(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running at port: http://localhost${process.env.PORT}`);
	})
})
.catch((error) => {
	console.log(`Database Connection failed !!`, error.message);
	process.exit(1)
})
