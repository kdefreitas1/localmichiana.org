require("dotenv").config("./backend/.env");

const puppeteer = require("puppeteer");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const ticketmasterApiKey = process.env.TICKETMASTER_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

let events = [];
let timestamp;

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

        timestamp = new Date().toISOString();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

fetchTicketmasterEvents();

app.get("/api/events", (req, res) => {
    res.json({
        events: events,
        timestamp: timestamp
    });
});

app.get("/test/events", async (req, res) => {
    try {
        let test = [];
        let pageNum = 1;
        let url = `https://www.eventbrite.com/d/united-states/all-events/?page=${pageNum}&bbox=-86.81387816523437%2C41.21951796097693%2C-85.75919066523437%2C42.189403230536186`;
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        let dataUrl;
        
        page.on("response", async (response) => {
            if(response.url().includes("/api/v3/destination/events/")) {
                dataUrl = response.url();
            }
        });

        await page.goto(url);

        while (true) {
            await page.reload();
            if (await page.$("li.Pagination-module__search-pagination__navigation-page___-xDRL:nth-child(3) > button:nth-child(1)") !== null) {
                await page.reload();
                console.log(`Cycle: ${pageNum}, Url: ${dataUrl}`);
                await page.goto(dataUrl);
                test = await page.content();
                console.log(typeof test);
                pageNum++;
                url = `https://www.eventbrite.com/d/united-states/all-events/?page=${pageNum}&bbox=-86.81387816523437%2C41.21951796097693%2C-85.75919066523437%2C42.189403230536186`;
                await page.goto(url);
            } else {
                await page.reload();
                await page.waitForSelector(".SearchResultPanelContentEventCardList-module__eventList___2wk-D > li:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > div:nth-child(1) > section:nth-child(2) > a:nth-child(1) > div:nth-child(1)", {visible: true,});
                break;
            }
        }

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