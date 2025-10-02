function displayEvents(data){
    const type = data.map(event => event.eventType);
    const allTypes = [...new Set(type)];
    
    const eventList = document.getElementById("eventList");
    data.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `
            <p>${event.name}</p>
            <p>${event.date}</p>
            <p>${event.eventType}</p>
            <a href="${event.url}">More Info</a>
            <p>${event.info}</p>
            <img src="${event.image}" alt="${event.name}">
            <p>${event.venue}</p>
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
            name: "Concert A",
            date: "2024-07-01",
            eventType: "Music",
            url: "http://example.com/concert-a",
            info: "An amazing music concert.",
            image: "http://example.com/image-a.jpg",
            venue: "Venue A",
        },
        {
            name: "Art Exhibition B",
            date: "2024-07-05",
            eventType: "Art",
            url: "http://example.com/art-b",
            info: "A stunning art exhibition.",
            image: "http://example.com/image-b.jpg",
            venue: "Venue B",
        },
    ];

    const eventList = document.getElementById("eventList");
    data.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `
            <p>${event.name}</p>
            <p>${event.date}</p>
            <p>${event.eventType}</p>
            <a href="${event.url}">More Info</a>
            <p>${event.info}</p>
            <img src="${event.image}" alt="${event.name}">
            <p>${event.venue}</p>
        `;
        eventList.appendChild(eventDiv);
    });
}

testDisplay();
*/