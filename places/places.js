function createPlaceCard(place) {
  const placesDiv = document.createElement("div");
  placesDiv.classList.add("place");

  placesDiv.innerHTML = `
      <h3>${place.name}</h3>
      <p><strong>Date:</strong> ${place.date}</p>
      <p><strong>City:</strong> ${place.city}</p>
      <p>No Link Avaliable</p>
      <img src="/front-page/placeholder image.svg" alt="Placeholder Image"">
    `;
  return placesDiv;
}

function displayPlaces(data) {
  const placesContainer = document.getElementById("places-container");
  placesContainer.innerHTML = "";
  data.forEach(place => {
    placesContainer.appendChild(createEventCard(place, false));
  });
}

function displayPlaceholderEvents() {
  data = [{
    name: "Placeholder Name",
    date: "N/A",
    city: "N/A",
  }];
  const placesContainer = document.getElementById("places-container");
  for (let i = 0; i < 50; i++) {
    placesContainer.appendChild(createPlaceCard(data[0]));
  }
}

displayPlaceholderEvents();