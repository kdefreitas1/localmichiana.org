function displayEvents(data){
    const eventList = document.getElementById("eventList");

    data.forEach(event => {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");

    eventDiv.innerHTML = `
      <h1>${event.name}</h1>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Type:</strong> ${event.eventType}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><a href="${event.url}" target="_blank">View Event</a></p>
      <img src="${event.image}" alt="${event.name}">
    `;

    eventList.appendChild(eventDiv);
  });
}

async function getEvents(){
    try{
        const response = await fetch('http://localhost:3000/api/events');
        const data = await response.json();
        displayEvents(data);
    }catch(error){
        console.error(error);
    }
}

getEvents();
