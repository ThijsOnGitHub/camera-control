var express = require('express');
var app = express();
var _a = require('rtsp-relay')(app), proxy = _a.proxy, scriptUrl = _a.scriptUrl;
// the endpoint our RTSP uses
app.ws('/api/stream/:cameraIP', function (ws, req) {
    return proxy({
        url: "rtsp://".concat(req.params.cameraIP, ":2000/feed"),
    })(ws);
});
app.listen(4123);
//# sourceMappingURL=server.js.map