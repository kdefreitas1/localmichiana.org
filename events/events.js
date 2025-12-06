function createEventCard(event, isPlaceholder) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  if (isPlaceholder == false) {
    eventDiv.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>City:</strong> ${event.city}</p>
      <p><a href="${event.url}" target="_blank">View Event</a></p>
      ${event.image ? `<img src="${event.image}" alt="${event.name}">` : ""}
    `;
  } else {
      eventDiv.innerHTML = `
      <h3>No Events Avaliable</h3>
      <p><strong>Date:</strong> N/A</p>
      <p><strong>Venue:</strong> N/A</p>
      <p><strong>City:</strong> N/A</p>
      <p>No Link Available</p>
      <div style="position: relative;">
        <img src="/front-page/No Image Available.svg" alt="No Image Available" style="display: block;">
        <p style="position: absolute; bottom: -10px; font-size: 5px;">
          Image Credit:
          <a href="https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg" style="color: black;">Ranjithsiji</a>,
          <a href="https://creativecommons.org/licenses/by-sa/4.0" style="color: black;">CC BY-SA 4.0</a>, via Wikimedia Commons
        </p>
      </div>
    `;
  }
  return eventDiv;
}

function displayEvents(data) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";
  data.forEach(event => {
    eventsContainer.appendChild(createEventCard(event, false));
  });
}

function displayPlaceholderEvents() {
  const data = [{
    name: "No Events Available",
    date: "N/A",
    venue: "N/A",
    city: "N/A",
  }];
  const eventsContainer = document.getElementById("events-container");
  for (let i = 0; i < 100; i++) {
    eventsContainer.appendChild(createEventCard(data[0], true));
  }
}

async function getEvents() {
  try {
    const response = await fetch("https://ticketmaster-worker.kamalani-defreitas.workers.dev/api/events");
    const data = await response.json();

    localStorage.setItem("eventsData", JSON.stringify(data));
    localStorage.setItem("eventsTimestamp", Date.now());

    displayEvents(data);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

function loadEvents() {
  const eventsData = localStorage.getItem("eventsData");
  const eventsTimestamp = localStorage.getItem("eventsTimestamp");
  
  if (eventsData && eventsTimestamp) {
    const now = Date.now();
    const sixHours = Number(eventsTimestamp) + 6 * 60 * 60 * 1000;

    if (now < sixHours) {
      displayEvents(JSON.parse(eventsData));
    } else {
      getEvents();
    }
  } else {
    getEvents();
  }
}

displayPlaceholderEvents();
loadEvents();