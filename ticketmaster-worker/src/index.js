import { env } from "cloudflare:workers";
import { handleAsNodeRequest } from "cloudflare:node";
import express from "express";
import puppeteer from "@cloudflare/puppeteer";

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "https://www.localmichiana.org");
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Vary", "Origin");
	if (req.method === "OPTIONS") return res.status(204).end();
  		next();
});

const ticketmasterApiKey = env.TICKETMASTER_API_KEY;

let events = [];
let scrapedEvents = [];
let places = [];
let loaded = false;
let copyright;
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

async function fetchEventbriteEvents() {
    try {
        let events = [];
        let data = [];
        let dataUrl;
        let pageNum = 1;
        let url = `https://www.eventbrite.com/d/united-states/all-events/?page=${pageNum}&bbox=-86.81387816523437%2C41.21951796097693%2C-85.75919066523437%2C42.189403230536186`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
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
                data = JSON.parse(await page.$eval("body > pre", el => el.textContent));
                events.push(...data.events.map(event => ({
                    name: event?.name,
                    date: event?.start_date,
                    eventType: event?.tags?.[1]?.display_name,
                    url: event?.url,
                    image: event?.image?.image_sizes?.large,
                    venue: event?.primary_venue?.name,
                    city: event?.primary_venue?.address?.city,
                })));
                pageNum++;
                url = `https://www.eventbrite.com/d/united-states/all-events/?page=${pageNum}&bbox=-86.81387816523437%2C41.21951796097693%2C-85.75919066523437%2C42.189403230536186`;
                await page.goto(url);
            } else {
                await page.reload();
                timestamp = new Date().toISOString();
                break;
            }
        }

        await browser.close();
        scrapedEvents = events;
        loaded = true;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

async function fetchPlaces() {
    try {
        const minLat = 41.105;
        const maxLat = 42.2654;
        const minLon = -87.063;
        const maxLon = -85.4781;
        
        const query = `
            [out:json]
            [bbox:${minLat},${minLon},${maxLat},${maxLon}];
            (
                node["leisure"="park"]["name"]["operator"]["access"!="private"];
                way["leisure"="park"]["name"]["operator"]["access"!="private"];
                relation["leisure"="park"]["name"]["operator"]["access"!="private"];
            );
            out body;
            `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: `data=${encodeURIComponent(query)}`
        });

        try {
            const data = await response.json();
            places = data.elements;
            timestamp = data.osm3s.timestamp_osm_base;
            copyright = data.osm3s.copyright;
        } catch (error) {
            console.log(await response.text());
        }
  
    } catch (error) {
        console.error("Error fetching places:", error);
    }
}

app.get("/events/tm", (req, res) => {
	res.json({
        events: events,
        timestamp: timestamp
    });
});

app.get("/events/eb", (req, res) => {
    res.json({
        events: scrapedEvents,
        timestamp: timestamp
    });
});

app.get("/places", (req, res) => {
    res.json({
        places: places,
        timestamp: timestamp,
        copyright: copyright
    });
});

app.listen(3000);

// if (!loaded) {
//     await fetchTicketmasterEvents();
//     await fetchPlaces();
//     fetchEventbriteEvents();
// }

export default {
    async fetch(request) {
        return handleAsNodeRequest(3000, request);
    },
    async scheduled(event, env, ctx) {
        ctx.waitUntil(fetchTicketmasterEvents());
        ctx.waitUntil(fetchPlaces());
        ctx.waitUntil(fetchEventbriteEvents());
    },
};