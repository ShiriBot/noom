/* http import */
import http from "http";
/* websocket import */
/* import WebSocket from "ws"; */
/* socket.io import */
import SocketIO from "socket.io";
/* express import */
import express from "express";

/* express applincation 구성 */
const app = express();

/* pug를 view engine으로 설정 */
app.set("view engine", "pug");
/* views 디렉토리 설정 */
app.set("views", __dirname+"/views");
/* public 폴더는 frontend 폴더. 해당 폴더만 유저에게 공개 */
app.use("/public", express.static(__dirname+"/public"));
/* (http protocol) 홈페이지로 이동 시 사용될 템플릿 렌더링 */
app.get("/", (req,res) => res.render("home")) ;
/* catchall url 다른 url을 입력해도 다시 home으로 돌아감 */
app.get("/*", (req,res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');
/* app.listen(3000, handleListen); */

/* 꼭 이렇게 해야하는 건 아니지만! 동시에 같은 포트를 사용하기 위해 */
/* websocket과 http를 동시에 사용하기 위해서 서버 생성. */ 
/*requestListener 경로로 express에서 생성한 application */
const httpServer = http.createServer(app);
/* socket.io 서버 */
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets: {
            adapter: { sids, rooms },
        }
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}


wsServer.on("connection", (socket) => {
    socket["nickname"]="Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
      console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome",socket.nickname);
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye",socket.nickname);
        });
    });
    socket.on("disconnect",()=>{
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("new_message", (msg, room, done)=>{
        socket.to(room).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"]=nickname)); 
});

/* 
Websocket 이용한 방법
--http 서버 위에 ws server 생성
const wss = new WebSocket.Server({server});
--fake database
--socket에 연결되었을 때 개별 socket을 인식하는 목록
const sockets=[];

--WebSocket connection event Listener
--callback : socket
wss.on("connection",(socket)=>{
    --socket에 연결되었을 때 개별 socket을 sockets에 추가
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅"); 
    
    --WebSocket disconnection event Listener
    --connect한 창을 꺼버렸을때
    socket.on("close",()=>console.log("Disconnected from the Browser"))
    
    --WebSocket message event Listener
    socket.on("message", msg => {
        --Stirng을 javascript object로 parse
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                --WebSocket send message from server to browser
                sockets.forEach((aSocket)=>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
            case "nickname":
                socket["nickname"] = message.payload;
        }        
    });
}); */

httpServer.listen(3000,handleListen);