async function getEvents(){
    try{
        const response = await fetch('http://localhost:3000/api/events');
        const data = await response.json();
        console.log(data);
        
    }catch(error){
        console.error(error);
    }
}

getEvents();