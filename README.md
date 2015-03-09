# Javascript library for access to the PROGREZZ's WebSocket API #

## 1. Introduction ##
Library for easy access to progreszz's server WebSocket API, using JSON format messages.

## 2. Usage ##

First, create a ```ProgrezzWS``` object:

```javascript
var ws = new ProgrezzWS();
```

Then, add some callbacks to it:

```javascript
/* Called when the websocket is being opened. */
ws.onOpen = function(event) {
  // Do whatever
  whatever_open("Connected");
}

/* Called when the websocket is being closed. */
ws.onClose   = function(event) {
  // Do whatever
  whatever_close("Disconnected");
}

/* This will be called when some error occurs.*/
ws.onError   = function(error) {
  // Do whatever (use ProgrezzWS.StringifyError() to stringify the error).
  whatever_error("<span style='color: red'>" + ProgrezzWS.StringifyError(error) + "</span>");
}

/* This is the most important method! It will be called as a callback when the server respond us with some information. A JSON object should always be recieved. */
ws.onMessage = function(msg_json) {
  whatever_message( msg_json );
}
```

Finally, open the websocket, do what ever, and close it. Keep it open as much as you wish: 

```javascript
ws.open( server_ws_url ); // ProgrezzWS.DEFAULT.URL will be used if no url is specified.
ws.send( {message: "hi!"} );  // Send the message as a json.
// ...
ws.close();
```

You can use ```ProgrezzWS.getTemplateRequest``` to get a request message template.

**IMPORTANT:** Make sure you call ```ws.open()``` or ```ws.close()``` **after the page has been loaded** (e.g. call them on ```window.onload```).

See *example.html* for more information.


## 3. Dependencies ##
Our library uses this dependencies:

- [WebSocket](https://www.websocket.org/): The browser or the web app that implements this api client must support WebSockets (HTML5).
