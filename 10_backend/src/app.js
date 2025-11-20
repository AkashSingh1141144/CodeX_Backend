import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// ================================
// CORS Middleware
// ================================
// Allows your backend to accept requests from your frontend URL.
// credentials: true → cookies, tokens, sessions allowed between frontend/backend.
app.use(cors({
  origin: process.env.CORS_ORIGIN,   // Allowed frontend URL (e.g., http://localhost:3000)
  credentials: true
}));

// ================================
// Parse JSON Request Body
// ================================
// Allows server to accept JSON data in request body.
// limit: 16kb → to prevent large payload attacks or huge file uploads.
app.use(express.json({
  limit: '16kb'
}));

// ================================
// Parse URL-ENCODED Data
// ================================
// For handling form submissions: contact forms, login forms, etc.
// extended: true → allows nested objects inside URL-encoded data.
app.use(express.urlencoded({
  limit: '16kb',
  extended: true
}));

// ================================
// Serving Static Files
// ================================
// Makes '/public' folder accessible publicly.
// Example: images, CSS, JS files.
// URL example: http://localhost:5000/logo.png
app.use(express.static('public'));

// ================================
// Cookie Parser Middleware
// ================================
// Allows reading and setting cookies easily.
// Useful for authentication (accessToken, refreshToken in cookies).
app.use(cookieParser());




// TODO:  routes import 

import userRouter from './routes/user.routes.js';

// routes declaration 
app.use('/api/v1/users', userRouter);

// Exporting app for server.js or index.js
export { app };
