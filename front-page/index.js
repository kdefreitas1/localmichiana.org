function displayEvents(data){
    const type = data.map(event => event.eventType);
    const allTypes = [...new Set(type)];
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
function testDisplay(){
    const type = ["arts","arts","music","sports","misc","sports","music","sports","misc",undefined];
    const allTypes = [...new Set(type)];
    console.log(allTypes);

    
}

testDisplay();
