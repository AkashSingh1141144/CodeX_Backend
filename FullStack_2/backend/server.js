import dotenv from 'dotenv'
dotenv.config()

import express from 'express'

const app = express()

const port = process.env.PORT || 4000


// app.get('/', (req, res) => {
// 	res.send('Sever is ready')
// })

app.get('/api/user', (req, res) => {
	const data = [
		{
			id: 1,
			name: 'Sandhya Viswakarma',
			email: 'sandhya@example.com',
			age: 20,
			city: 'Ramnagar'
		},
		{
			id:2,
			name: 'Akash Singh',
			email: 'akash@example.com',
			age: 22,
			city: 'Varanasi'
		}
	]

	res.json(data)
})

app.listen(port, () => (
	console.log(`Server is running on http://localhost:${port}`)
))