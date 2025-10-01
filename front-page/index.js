async function getEvents(){
    try{
        const response = await fetch('http://localhost:3000/api/events');
        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
    }
}

function displayEvents(data){
    const names = data.map(event => event.name);
    console.log(names);
}

displayEvents(getEvents());