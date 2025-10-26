import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI();

// app.post('/api/chat', async (req, res) => {
//     try {
//         const { personaPrompt, userMessage } = req.body;
//         const response = await client.chat.completions.create({
//             model: 'gpt-4o-mini',
//             messages: [
//                 {
//                     role: 'system',
//                     content: personaPrompt
//                 },
//                 {
//                     role: 'user',
//                     content: userMessage
//                 }
//             ]
//         });
//         res.json({ content: response.choices[0].message.content });
//     }
//     catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({
//             error: 'Failed to get response from API',
//             details: error.message
//         });
//     }
// });


app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format, expected array' });
        }

        // Validate that each message has the correct format
        for (let i = 0; i < messages.length; i++) {
            if (!messages[i].role || !messages[i].content) {
                return res.status(400).json({
                    error: `Message ${i} is missing 'role' or 'content'`
                });
            }
            if (typeof messages[i].content !== 'string') {
                return res.status(400).json({
                    error: `Message ${i} has invalid content type. Expected string.`
                });
            }
        }

        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages
        });

        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        console.error("Error processing API request:", error);
        res.status(500).json({
            error: 'Failed to get response from API',
            details: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});