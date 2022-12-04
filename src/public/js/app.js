const socket = io();

const myFace = document.getElementById("myFace");

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

const camerasSelect = document.getElementById("cameras");

/* stream = video+audio */
let myStream;
/* 음소거와 카메라를 제어하기 위한 변수 */
let muted = false;
let cameraOff = false;

async function getCameras() {
    try { 
        /* enumerateDevices() : 컴퓨터에 연결되어 있는 모든 장치의 목록 */
        const devices = await navigator.mediaDevices.enumerateDevices();
        /* 비디오 입력장치(카메라)만 필터링 */
        const cameras = devices.filter( device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks();
        /* 불러온 카메라를 화면 option에 삽입하기*/
        cameras.forEach(camera=>{
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText=camera.label;
            if(currentCamera.label == camera.label){
                option.selected = true;
            }
        })
     } catch (e) { console.log(e); }
}

/* Stream을 가져오는 오브젝트 */
async function getMedia(deviceId) {
    /* 웹캠이 없어서 video는 주석처리 */
    /* deviceId가 없을 때 실행시킬 */
    const initialConstraints = {
        audio: true,
        video: { facingMode: "user" },
      };
      const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
      };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints: initialConstraints
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
        
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function handleMuteClick() {
    /* track?을 이용하여 on/off 제어 */
    myStream.getAudioTracks().forEach((track) => track.enabled = !track.enabled);
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick() {
    /* myStream.getvideoTracks().forEach((track) => track.eabled = !track.enabled); */
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange(){
    await getMedia(camerasSelect.value);
}

/* 음소거 버튼 Event Listener */
muteBtn.addEventListener("click", handleMuteClick);
/* 카메라 버튼 Event Listener */
cameraBtn.addEventListener("click", handleCameraClick);
/* 카메라 선택 Event Listener */
camerasSelect.addEventListener("input", handleCameraChange);