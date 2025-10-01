function displayEvents(data){
    const names = data.map(event => event.name);
    console.log(names);
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