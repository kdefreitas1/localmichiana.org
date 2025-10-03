function displayEvents(data){
    const type = data.map(event => event.eventType);
    const allTypes = [...new Set(type)];
    
    const eventList = document.getElementById("eventList");
    data.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `
            <h1>Name: ${event.name}</h1>
            <p>Date: ${event.date}</p>
            <p>Event Type: ${event.eventType}</p>
            <p>Url: <a href="${event.url}">${event.url}</a></p>
            <p>Info: ${event.info}</p>
            <img src="${event.image}" alt="${event.name}">
            <p>Venue: ${event.venue}</p>
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


// For testing purposes. It will be removed later.

/*
function testDisplay(){
    const data = [
        {
            name: "Concert",
            date: "2025-11-02",
            eventType: "Music",
            url: "https://example.com/concert",
            info: "An amazing music concert.",
            image: "http://example.com/concert.jpg",
            venue: "Venue 1",
        },
        {
            name: "Random Play",
            date: "2026-07-05",
            eventType: "Theatre",
            url: "https://example.com/theatre",
            info: "A stunning play.",
            image: "https://example.com/theatre.jpg",
            venue: "Venue 2",
        },
    ];

    const eventList = document.getElementById("eventList");
    data.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `
            <h1>Name: ${event.name}</h1>
            <p>Date: ${event.date}</p>
            <p>Event Type: ${event.eventType}</p>
            <p>Url: <a href="${event.url}">${event.url}</a></p>
            <p>Info: ${event.info}</p>
            <img src="${event.image}" alt="${event.name}">
            <p>Venue: ${event.venue}</p>
        `;
        eventList.appendChild(eventDiv);
    });
}

testDisplay();
*/