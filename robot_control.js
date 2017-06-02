function ReconnectingWebSocket(a) {
    function f(g) {
        c = new WebSocket(a);
        if (b.debug || ReconnectingWebSocket.debugAll) {
            console.debug("ReconnectingWebSocket", "attempt-connect", a)
        }
        var h = c;
        var i = setTimeout(function () {
            if (b.debug || ReconnectingWebSocket.debugAll) {
                console.debug("ReconnectingWebSocket", "connection-timeout", a)
            }
            e = true;
            h.close();
            e = false
        }, b.timeoutInterval);
        c.onopen = function (c) {
            clearTimeout(i);
            if (b.debug || ReconnectingWebSocket.debugAll) {
                console.debug("ReconnectingWebSocket", "onopen", a)
            }
            b.readyState = WebSocket.OPEN;
            g = false;
            b.onopen(c)
        };
        c.onclose = function (h) {
            clearTimeout(i);
            c = null;
            if (d) {
                b.readyState = WebSocket.CLOSED;
                b.onclose(h)
            } else {
                b.readyState = WebSocket.CONNECTING;
                if (!g && !e) {
                    if (b.debug || ReconnectingWebSocket.debugAll) {
                        console.debug("ReconnectingWebSocket", "onclose", a)
                    }
                    b.onclose(h)
                }
                setTimeout(function () {
                    f(true)
                }, b.reconnectInterval)
            }
        };
        c.onmessage = function (c) {
            if (b.debug || ReconnectingWebSocket.debugAll) {
                console.debug("ReconnectingWebSocket", "onmessage", a, c.data)
            }
            b.onmessage(c)
        };
        c.onerror = function (c) {
            if (b.debug || ReconnectingWebSocket.debugAll) {
                console.debug("ReconnectingWebSocket", "onerror", a, c)
            }
            b.onerror(c)
        }
    }

    this.debug = false;
    this.reconnectInterval = 1e3;
    this.timeoutInterval = 2e3;
    var b = this;
    var c;
    var d = false;
    var e = false;
    this.url = a;
    this.readyState = WebSocket.CONNECTING;
    this.URL = a;
    this.onopen = function (a) {
    };
    this.onclose = function (a) {
    };
    this.onmessage = function (a) {
    };
    this.onerror = function (a) {
    };
    f(a);
    this.send = function (d) {
        if (c) {
            if (b.debug || ReconnectingWebSocket.debugAll) {
                console.debug("ReconnectingWebSocket", "send", a, d)
            }
            return c.send(d)
        } else {
            throw"INVALID_STATE_ERR : Pausing to reconnect websocket"
        }
    };
    this.close = function () {
        if (c) {
            d = true;
            c.close()
        }
    };
    this.refresh = function () {
        if (c) {
            c.close()
        }
    }
}

ReconnectingWebSocket.debugAll = false;

// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
    var ws_scheme = "wss://";
} else {
    var ws_scheme = "ws://";
}


var inbox = new ReconnectingWebSocket("wss://robot.kramertechsolutions.com" + "/receive");
var outbox = new ReconnectingWebSocket("wss://robot.kramertechsolutions.com" + "/submit");


(function (ext) {

    var studentHandle = "";

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    inbox.onclose = function () {
        console.log('inbox closed');
        this.inbox = new WebSocket(inbox.url);

    };

    outbox.onclose = function () {
        console.log('outbox closed');
        this.outbox = new WebSocket(outbox.url);
    };

    // Block functions
    ext.setStudentHandle = function (handle, callback) {
         studentHandle = handle;
    };

    ext.turnMast = function (degree, callback) {
        var text = "Mast " + degree;
        outbox.send(JSON.stringify({handle: studentHandle, text: text}));

    };

    ext.moveForward = function (callback) {
        var text = "Forward";
        outbox.send(JSON.stringify({handle: studentHandle, text: text}));

    };


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, name and function
            [' ', 'Set student handle ID %s', 'setStudentHandle', 0],
            [' ', 'Forward', 'moveForward', 0],
            [' ', 'Turn mast %n degrees', 'turnMast', 0]
        ],
        menus: {
            sensor: ['Temperature', 'Humidity', 'Rain Fall', 'Wind Direction', 'Wind Speed'],
            location: ['School', 'Classroom']
        }
    };

    // Register the extension
    ScratchExtensions.register('Robot Command', descriptor, ext);
})({});