require('dotenv').config();
const express = require('express');

const app = express();

const port = process.env.PORT || 4000;

const usersApi = {
  id: 1,
  name: "Akash Kumar Singh",
  email: "akash@example.com",
  phone: "1234567890",
  age: 22,
  isStudent: true,
  skills: ["JavaScript", "TypeScript", "React", "Node.js"],
  address: {
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India"
  }
};

app.get('/', (req, res) => {
  res.send('Hello Backend World!');
});

app.get('/user', (req, res) => {
  res.json(usersApi);
});

app.listen(port, () => {
  console.log(` Backend Example app listening on port ${port}`);
});
