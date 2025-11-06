function createEventCard(event) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  eventDiv.innerHTML = `
    <h3>${event.name}</h3>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Venue:</strong> ${event.venue}</p>
    <p><strong>City:</strong> ${event.city}</p>
    <p><a href="${event.url}" target="_blank">View Event</a></p>
    ${event.image ? `<img src="${event.image}" alt="${event.name}">` : ""}
  `;

  return eventDiv;
}

function displayEvents(data) {
  const eventsContainer = document.getElementById("eventsContainer");
  data.forEach(event => {
    eventsContainer.appendChild(createEventCard(event));
  });
}

async function getEvents() {
    try {
        const response = await fetch("http://localhost:3000/api/events");
        const data = await response.json();
        displayEvents(data);
    } catch (error) {
        console.error(error);
    }
}

getEvents();