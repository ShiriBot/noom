/* http import */
import http from "http";
/* websocket import */
/* import WebSocket from "ws"; */
/* socket.io import */
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
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
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  });

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName,done) =>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome"); 
    });
});


httpServer.listen(3000,handleListen);