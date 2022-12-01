const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden=true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message;
    ul.appendChild(li);
}

function showRoom(){
    welcome.hidden=true;
    room.hidden=false;
    const h3 = room.querySelector("h3");
    h3.innerText=`Room ${roomName}`
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    /* 원하는 이름의 event 발생 가능. object 전송 가능 */
    socket.emit("enter_room",input.value,showRoom);
    roomName=input.value;
    input.value="";
}


form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", ()=>{
    addMessage("sumeone joined!");
});