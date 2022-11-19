"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const atem_connection_1 = require("atem-connection");
const myAtem = new atem_connection_1.Atem();
myAtem.connect('192.168.10.240').then(() => {
    console.log('Connected!');
}).catch((error) => {
    console.log('Error connecting', error);
});
const { proxy, scriptUrl } = require('rtsp-relay')(app);
myAtem.on('connected', () => {
    console.log("connected");
});
// the endpoint our RTSP uses
app.ws('/api/stream/:cameraIP', (ws, req) => proxy({
    url: `rtsp://${req.params.cameraIP}:554/live/av1`,
})(ws));
app.get('/api/setInput/:input', (req, res) => {
    myAtem.changeProgramInput(parseInt(req.params.input)).then(value => res.sendStatus(200));
});
app.ws('/atem-events', (ws, req) => {
    ws.send(JSON.stringify({ event: 'stateChanged', data: myAtem.state }));
    myAtem.on('stateChanged', (state) => {
        ws.send(JSON.stringify({ event: 'stateChanged', data: state }));
    });
    /*setInterval(() => {
        ws.send(JSON.stringify({event:"stateChanged",data:{video:{mixEffects:[{programInput:6,previewInput:[1,5,6,7,8][randomInt(0,5)]}]}}}))
    }, 5000)*/
});
app.listen(4123);
//# sourceMappingURL=server.js.map