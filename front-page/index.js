function createEventCard(event, isPlaceholder) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  if(isPlaceholder == false) {
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
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>City:</strong> ${event.city}</p>
      <p>No Link Avaliable</p>
      <img src="/front-page/No Image Avaliable.png" alt="No Image Available">
    `;
  }
  return eventDiv;
}

function displayEvents(data) {
  const eventsContainer = document.getElementById("events-container");
  for(let i = 0; i < 10; i++) {
    eventsContainer.appendChild(createEventCard(data[i], false));
  }
}

function displayPlaceholderEvents() {
  data = [{
    name: "No Events Available",
    date: "N/A",
    venue: "N/A",
    city: "N/A",
  }];
  const eventsContainer = document.getElementById("events-container");
  for (let i = 0; i < 10; i++) {
    eventsContainer.appendChild(createEventCard(data[0], true));
  }
}

async function getEvents() {
    try {
      const response = await fetch("http://localhost:3000/api/events");
      if (!response.ok) {
        throw new Error("Response not ok");
      } else {
        const data = await response.json();
        displayEvents(data);
      }
    } catch (error) {
      displayPlaceholderEvents();
      console.error(error);
    }
}

getEvents();