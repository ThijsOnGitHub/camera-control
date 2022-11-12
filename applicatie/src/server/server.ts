import * as express from 'express'
import * as expressWs from 'express-ws';
const app = express() as unknown as expressWs.Application
app.get('/', (req, res) => {
    res.send('Hello World!')
}   )
import { Atem } from 'atem-connection'
const myAtem = new Atem()
myAtem.connect('192.168.10.240')
const { proxy, scriptUrl } = require('rtsp-relay')(app);


// the endpoint our RTSP uses
app.ws('/api/stream/:cameraIP', (ws, req) =>
    proxy({
        url: `rtsp://${req.params.cameraIP}:554/live/av0`,
    })(ws),
);

app.get('/api/setInput/:input',(req,res)=>{
    myAtem.changeProgramInput(parseInt(req.params.input)).then(value => res.sendStatus(200))
})

app.ws('/atem-events', (ws, req) =>{
    myAtem.on('stateChanged',(state) => {
        ws.send({event:'stateChanged',data:state})
    })
    /*setInterval(() => {
        ws.send(JSON.stringify({event:"stateChanged",data:{video:{mixEffects:[{programInput:6,previewInput:[1,5,6,7,8][randomInt(0,5)]}]}}}))
    }, 5000)*/
});
app.listen(4123)