/* 주고받은 메시지를 표시하는 ul */
const messageList =document.querySelector("ul");
/* nickname 송신용 form */
const nickForm =document.querySelector("#nick");
/* 메시지 송신용 form */
const messageForm =document.querySelector("#message");
/* websocket 연결 */
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}


/* Websocket open(connect) event Listener*/
socket.addEventListener("open",()=>{
    console.log("Connected to Server ✅");
});

/* Websocket message event Listener */
socket.addEventListener("message",(message)=>{
    /* 새로운 li 요소 만들기 */
    const li = document.createElement("li");
    /* 새로 만든 li에 받은 메시지 입력 */
    li.innerText = message.data;
    /* 새로 만든 li를 messageListd에 추가 */
    messageList.append(li);
});

/* Websocket close(disconnect) event Listener */
socket.addEventListener("close",()=>{
    console.log("Disconnected to Server ❌");
});

/* 10초 뒤에 server에 message 송신 */
/* setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000); */

function handleSubmit(event){
    event.preventDefault();
    /* messageForm에서 input box(=browser에서 타이핑) 찾기 */
    const input = messageForm.querySelector("input");
    /* input box 내부 value를 송신 */
    socket.send(makeMessage("new_message", input.value));
    /* input box 비우기 */
    input.value="";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input")
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

