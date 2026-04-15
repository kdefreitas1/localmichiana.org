function createItemCard(item, isPlaceholder, type) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  if (type === "event" && isPlaceholder === false) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Venue:</strong> ${item.venue}</p>
      <p><strong>City:</strong> ${item.city}</p>
      <p><a href="${item.url}" target="_blank">View Event</a></p>
      ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}
    `;
  } else if (type === "event" && isPlaceholder === true) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Venue:</strong> ${item.venue}</p>
      <p><strong>City:</strong> ${item.city}</p>
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
  } else if (type === "place" && isPlaceholder === true) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>City:</strong> ${item.city}</p>
      <p>No Link Available</p>
      <img src="/front-page/placeholder image.svg" alt="Placeholder Image">
    `;
  }
  return itemDiv;
}

function displayEvents(data) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    eventsContainer.appendChild(createItemCard(data.events[i], false, "event"));
  }
}

function displayPlaceholder(name, containerId, type) {
  const data = [{
    name: name,
    date: "N/A",
    venue: "N/A",
    city: "N/A",
  }];
  const itemsContainer = document.getElementById(containerId);
  for (let i = 0; i < 10; i++) {
    itemsContainer.appendChild(createItemCard(data[0], true, type));
  }
}

async function getEvents() {
  try {
    const response = await fetch(
      "https://api.localmichiana.org/api/events",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    );
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

displayPlaceholder("No Events Available", "events-container", "event");
displayPlaceholder("Placeholder Name", "places-container", "place");
loadEvents();