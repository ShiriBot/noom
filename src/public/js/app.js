const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden=true;

let roomName;

function showRoom(){
    welcome.hidden=true;
    room.hidden=false;
    const h3 = room.querySelector("h3");
    h3.innerText=`Room ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}

function addMessage(message){
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message;
    ul.appendChild(li);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    /* 원하는 이름의 event 발생 가능. object 전송 가능 */
    socket.emit("enter_room",input.value,showRoom);
    roomName=input.value;
    input.value="";
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () =>{
        addMessage(`You: ${value}`);
    });
    input.value="";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", ()=>{
    addMessage("someone joined!");
});

socket.on("bye", ()=>{
    addMessage("someone left...");
});

socket.on("new_message", addMessage);