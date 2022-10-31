const express = require('express')
const app = express()

const { proxy, scriptUrl } = require('rtsp-relay')(app);

// the endpoint our RTSP uses
app.ws('/api/stream/:cameraIP', (ws, req) =>
    proxy({
        url: `rtsp://${req.params.cameraIP}:2000/feed`,
    })(ws),
);

app.listen(4123)