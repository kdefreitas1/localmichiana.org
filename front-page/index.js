function createItemCard(item, isPlaceholder, type) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  if (type == "event" && isPlaceholder == false) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Venue:</strong> ${item.venue}</p>
      <p><strong>City:</strong> ${item.city}</p>
      <p><a href="${item.url}" target="_blank">View Event</a></p>
      ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}
    `;
  } else if (type == "event" && isPlaceholder == true) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Venue:</strong> ${item.venue}</p>
      <p><strong>City:</strong> ${item.city}</p>
      <p>No Link Avaliable</p>
      <div style="position: relative;">
        <img src="/front-page/No Image Avaliable.svg" alt="No Image Available" style="display: block;">
        <p style="position: absolute; bottom: -10px; font-size: 5px;">
          Image Credit:
          <a href="https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg" style="color: black;">Ranjithsiji</a>,
          <a href="https://creativecommons.org/licenses/by-sa/4.0" style="color: black;">CC BY-SA 4.0</a>, via Wikimedia Commons
        </p>
      </div>
    `;
  } else if (type == "place" && isPlaceholder == true) {
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>City:</strong> ${item.city}</p>
      <p>No Link Avaliable</p>
      <img src="/front-page/placeholder image.svg" alt="No Image Available"">
    `;
  }
  return itemDiv;
}

function displayEvents(data) {
  const eventsContainer = document.getElementById("events-container");
  for(let i = 0; i < 10; i++) {
    eventsContainer.appendChild(createItemCard(data[i], false, "event"));
  }
}

function displayPlaceholder(name, containerId, type) {
  data = [{
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
      const response = await fetch("http://localhost:3000/api/events");
      if (!response.ok) {
        throw new Error("Response not ok");
      } else {
        const data = await response.json();
        displayEvents(data);
      }
    } catch (error) {
      displayPlaceholder("No Events Available", "events-container", "event");
      console.error(error);
    }
}

getEvents();
displayPlaceholder("Placeholder Name", "places-container", "place");