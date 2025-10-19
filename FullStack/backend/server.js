import express from "express";

const app = express();

const port = process.env.PORT || 4000;

// app.get('/', (req, res) => {
// 	res.send('Sever is ready')
// })

// Jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      text: "What did the cheese say when it looked in the mirror?",
      answer: "Hello-me (Halloumi)",
    },
    {
      id: 2,
      text: "What kind of cheese do you use to disguise a small horse?",
      answer: "Stallion cheese (Gouda)",
    },
    {
      id: 3,
      text: "What kind of cheese do you use to disguise a small horse?",
      answer: "Stallion cheese (Gouda)",
    },
    {
      id: 4,
      text: "What kind of cheese do you use to disguise a small horse?",
      answer: "Stallion cheese (Gouda)",
    },
    {
      id: 5,
      text: "What kind of cheese do you use to disguise a small horse?",
      answer: "Stallion cheese (Gouda)",
    },
  ];

  res.json(jokes);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
