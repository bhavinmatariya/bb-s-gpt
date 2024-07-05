const express = require('express');
const bodyParser = require('body-parser');
const { getChatGptResponse } = require('./src/chatgptService');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    const question = req.body.question;
    if (!question) {
        return res.status(400).send({ error: 'Question is required' });
    }

    try {
        const response = await getChatGptResponse(question);
        res.send(response);
    } catch (error) {
        res.status(500).send({ error: 'Error getting response from ChatGPT' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
