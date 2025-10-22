// import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config(); 

// const app = express();
// const port = 4000;

// MongoDB connect
connectDB();

// basic route
// app.get("/", (req, res) => {
//   res.send("Hello Akash! MongoDB Connected Successfully 🚀");
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
