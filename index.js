// index.js (Express Serverless Function for Vercel)

// 1. Load environment variables (must be the first import)
import 'dotenv/config'; 

import { GoogleGenAI } from '@google/genai';
import express from 'express'; // <--- Import Express

const app = express();
const ai = new GoogleGenAI({}); 
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// ----------------------------------------------------
// 2. Define the API Endpoint
// Vercel routes all requests to this file's handler if vercel.json is set up.
// Here we define a simple GET route for testing.
// ----------------------------------------------------

app.get('/api/generate', async (req, res) => {
    
    const model = "gemini-2.5-flash"; 
    
    // You can dynamically get a prompt from the request body or query params if needed
    const prompt = "Given the project 'Autoleadsa1', generate a brief, professional cold email subject line.";

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        // 3. Send the AI response back as the HTTP response
        res.status(200).json({
            success: true,
            prompt: prompt,
            result: response.text.trim()
        });

    } catch (error) {
        // Send the error message back to the client
        console.error("Gemini API Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to call Gemini API",
            error: error.message
        });
    }
});

// If you visit the root URL, show a simple message
app.get('/', (req, res) => {
    res.send("Autoleadsa1 API is running. Visit /api/generate to test the endpoint.");
});


// ----------------------------------------------------
// 4. Export the Express app
// Vercel requires the serverless function to be exported.
// ----------------------------------------------------
// The listen is commented out as Vercel handles the port listening internally.
// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;