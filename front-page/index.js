function parseDate(value){
  // Try to parse ISO or common date formats; fallback to null
  if(!value) return null;
  const d = new Date(value);
  if(!isNaN(d)) return d;
  // try replacing common separators
  const alt = value.replace(/(st|nd|rd|th)/g, '').replace(/-/g,'/');
  const d2 = new Date(alt);
  return isNaN(d2) ? null : d2;
}

function createEventCard(event){
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  const when = event.date || '';
  const img = event.image ? `<img src="${event.image}" alt="${event.name}">` : '';

  eventDiv.innerHTML = `
    <h1>${event.name || 'Untitled'}</h1>
    <p><strong>Date:</strong> ${when}</p>
    <p><strong>Venue:</strong> ${event.venue || ''}</p>
    <p><a href="${event.url || '#'}" target="_blank">View Event</a></p>
    ${img}
  `;

  return eventDiv;
}

function displayEvents(data){
  // buckets for the 5 columns
  const buckets = {
    sports: [],
    arts: [],
    music: [],
    misc: [],
    undefined: []
  };

  // Normalize and bucket events
  data.forEach(ev => {
    const typeRaw = (ev.eventType || '').toLowerCase().trim();
    let key = 'undefined';
    if(typeRaw.includes('sport')) key = 'sports';
    else if(typeRaw.includes('art') || typeRaw.includes('theatre') || typeRaw.includes('theater')) key = 'arts';
    else if(typeRaw.includes('music')) key = 'music';
    else if(typeRaw.length === 0) key = 'undefined';
    else key = 'misc';

    // attach parsed date for sorting
    const parsed = parseDate(ev.date);
    ev._parsedDate = parsed;
    buckets[key].push(ev);
  });

  // Sort each bucket by date ascending (earliest first). Null dates go to the end.
  Object.keys(buckets).forEach(k => {
    buckets[k].sort((a,b) => {
      const da = a._parsedDate;
      const db = b._parsedDate;
      if(da && db) return da - db;
      if(da && !db) return -1;
      if(!da && db) return 1;
      return 0;
    });
  });

  // clear existing lists
  ['sports','arts','music','misc','undefined'].forEach(k => {
    const listEl = document.getElementById(`list-${k}`);
    if(listEl) listEl.innerHTML = '';
  });

  // render into columns
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
    if(Array.isArray(data)) displayEvents(data);
    else console.error('Expected array from /api/events', data);
  }catch(error){
    console.error(error);
  }
}

getEvents();
