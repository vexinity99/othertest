// join.js
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();

app.use(express.json());

// POST /api/join
app.post('/api/join', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, msg: "Missing game code" });
    }

    try {
        // Example Blooket join URL (adjust as needed)
        const response = await fetch(`https://api.blooket.com/api/join/${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ /* your payload here */ })
        });

        const text = await response.text();

        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // Not JSON, treat as HTML or plain text
            data = { raw: text };
        }

        // Send JSON back to frontend
        res.json({ success: true, data });

    } catch (err) {
        console.error("Join error:", err);
        res.status(500).json({ success: false, msg: "Server error", error: err.toString() });
    }
});

// Example frontend-friendly clipboard endpoint
app.post('/api/copy', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, msg: "No text provided" });

    try {
        require('child_process').execSync(`echo ${text.replace(/"/g, '\\"')} | clip`);
        res.json({ success: true, msg: "Copied to clipboard" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Failed to copy", error: err.toString() });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
