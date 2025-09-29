require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const app = express();

const ticketmasterApiKey = process.env.TICKETMASTER_API_KEY;
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/api/events', async (req, res) => {
    try {
        const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?&city=South+Bend&stateCode=IN&radius=30&unit=miles&sort=date,asc&apikey=${ticketmasterApiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});
console.log("Starting the server...");
app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});