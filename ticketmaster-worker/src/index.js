import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express from "express";

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
const cron = require("node-cron");

const ticketmasterApiKey = env.TICKETMASTER_API_KEY;

let events = [];
let lastUpdated = null;

async function fetchEvents() {
	try {
		const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=dp6tj&radius=40&unit=miles&size=150&sort=date,asc&apikey=${ticketmasterApiKey}`;
		const response = await fetch(apiUrl);
		const data = await response.json();
		console.log(data);
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
	res.json(events);
}

fetchEvents();
cron.schedule("0 */24 * * *", fetchEvents);

app.get("/api/events", async (req, res) => {
	res.json(events);
});


app.listen(3000);

export default httpServerHandler({ port: 3000 });