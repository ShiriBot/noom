const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg){
    console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    /* 원하는 이름의 event 발생 가능. object 전송 가능 */
    socket.emit("enter_room",input.value,backendDone);
    input.value="";
}


form.addEventListener("submit", handleRoomSubmit);