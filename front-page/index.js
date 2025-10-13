function createEventCard(event) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  eventDiv.innerHTML = `
    <h1>${event.name || 'Untitled Event'}</h1>
    <p><strong>Date:</strong> ${event.date || 'TBA'}</p>
    <p><strong>Venue:</strong> ${event.venue || 'Not specified'}</p>
    <p><a href="${event.url || '#'}" target="_blank">View Event</a></p>
    ${event.image ? `<img src="${event.image}" alt="${event.name}">` : ''}
  `;

  return eventDiv;
}

function displayEvents(data) {
  // buckets for 5 columns
  const buckets = {
    sports: [],
    arts: [],
    music: [],
    misc: [],
    undefined: []
  };

  // Categorize each event
  data.forEach(event => {
    const type = (event.eventType || "").toLowerCase();
    let key;

   if(type.includes('sport')) key = 'sports';
    else if(type.includes('art') || type.includes('theatre') || type.includes('theater')) key = 'arts';
    else if(type.includes('music')) key = 'music';
    else if(type.length === 0 || type.includes("undefined")) key = 'undefined';
    else key = 'misc';

    buckets[key].push(event);
  });



  // Render each bucket
  buckets.sports.forEach(ev => document.getElementById('list-sports').appendChild(createEventCard(ev)));
  buckets.arts.forEach(ev => document.getElementById('list-arts').appendChild(createEventCard(ev)));
  buckets.music.forEach(ev => document.getElementById('list-music').appendChild(createEventCard(ev)));
  buckets.misc.forEach(ev => document.getElementById('list-misc').appendChild(createEventCard(ev)));
  buckets.undefined.forEach(ev => document.getElementById('list-undefined').appendChild(createEventCard(ev)));
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