import {createRef, FC, useEffect, useRef} from "react";

export const Stream: FC = ()=>{
    const video = createRef<HTMLVideoElement>()

    useEffect(()=>{
        let queue:BufferSource[] = [];
        let sourceBuffer: SourceBuffer
        let ms = new MediaSource();
        if(video.current){
            video.current.src = window.URL.createObjectURL(ms);
            ms.addEventListener('sourceopen', onMediaSourceOpen);
        }
        //ws://192.168.1.163:8088/live/av0
        function onMediaSourceOpen() {
            sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.4D0033, mp4a.40.2"');
            sourceBuffer.addEventListener("updateend",loadPacket);
            sourceBuffer.addEventListener("onerror", sourceError);
        }

        function sourceError() {
            console.log("Media source error");
        }

        function loadPacket() { // called when sourceBuffer is ready for more
            if (!sourceBuffer.updating) {
                let data = queue.shift(); // pop from the beginning
                if(data){
                    console.log("data")
                    appendToBuffer(data);
                }
            } else {
            }
        }

        function appendToBuffer(videoChunk: BufferSource) {
            if (videoChunk) {
                sourceBuffer.appendBuffer(videoChunk);
            }
        }

            var webSocketURL = null;
            var keepAliveCount = 0;

            webSocketURL ="ws://192.168.1.163:8088/live/av0" //protocol + "://" + hostname + ":" + port + endpoint;
            console.log("openWSConnection::Connecting to: " + webSocketURL);

            const offline = `<h4><span class="badge bg-danger">Disconnected</span></h4>`
            const online = `<h4><span class="badge bg-success">Connected</span></h4>`

            let statusBadge = document.getElementById("status");

            try {
                let webSocket = new WebSocket(webSocketURL);
                webSocket.onopen = function(openEvent) {
                    var open = JSON.stringify(openEvent, null, 4);
                    console.log("WebSocket open");
                };
                webSocket.onclose = function (closeEvent) {
                    var closed = JSON.stringify(closeEvent, null, 4);
                };
                webSocket.onerror = function (errorEvent) {
                    var error = JSON.stringify(errorEvent, null, 4);
                };
                webSocket.onmessage = function (messageEvent) {
                    var wsMsg = messageEvent.data;
                    if (typeof wsMsg === 'string') {
                    } else {
                        let arrayBuffer;
                        let fileReader = new FileReader();
                        fileReader.onload = function(event) {
                            if(event.target){
                                arrayBuffer = event.target.result;
                                if(typeof arrayBuffer != "string" ){
                                    let data = new Uint8Array(arrayBuffer as ArrayBuffer);
                                    //document.getElementById("incomingMsgOutput").value += "received: " + data.length + " bytes\r\n";
                                    appendToBuffer(data) // add to the end
                                }
                            }

                        };
                        fileReader.readAsArrayBuffer(wsMsg);
                        /* NOTE: the web server has a idle-timeout of 60 seconds,
                         so we need to send a keep-alive message regulary*/
                        keepAliveCount++;
                        if (keepAliveCount >= 10 && webSocket.readyState == WebSocket.OPEN) {
                            keepAliveCount = 0;
                            webSocket.send("keep-alive");
                        }
                    }
                };
            } catch (exception) {
                console.error(exception);
            }

    },[])

    return (<div><video ref={video}></video></div>)
}



