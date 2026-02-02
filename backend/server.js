require("dotenv").config("./backend/.env");

const puppeteer = require("puppeteer");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const ticketmasterApiKey = process.env.TICKETMASTER_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

let events = [];
let testEvents = [];

async function fetchTicketmasterEvents() {
    try {
        const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=dp6tj&radius=40&unit=miles&size=150&sort=date,asc&apikey=${ticketmasterApiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const eventImages = data._embedded.events.map(event => {
            let found = event.images?.find(img => img.url.includes("SOURCE"))
            || event.images?.find(img => img.url.includes("LARGE"))
            || event.images?.[0]?.url;

            return found?.url;
        });

        events = data._embedded.events.map((event, i) => ({
            name: event.name,
            date: event.dates.start.localDate,
            eventType: event.classifications?.[0]?.segment?.name,
            url: event?.url,
            info: event?.info,
            image: eventImages[i],
            venue: event._embedded?.venues?.[0]?.name,
            city: event._embedded?.venues?.[0]?.city?.name,
        }));

    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

fetchTicketmasterEvents();

app.get("/api/events", (req, res) => {
    res.json(events);
});

app.get("/test/events", async (req, res) => {
    try {
        const apiUrl = `https://example.com/`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(apiUrl);
        await page.screenshot({ path: "screenshot.png" });
        await browser.close();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
});

app.get("/test/places", async (req, res) => {
    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.6629,-86.2529&radius=40000&type=point_of_interest&key=${googleApiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching places:", error);
    }
});

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});