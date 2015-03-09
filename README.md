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
  document.getElementById("connect_btn").disabled = true;
  document.getElementById("disconnect_btn").disabled = false;
  append_response("Connected");
}

/* Called when the websocket is being closed. */
ws.onClose   = function(event) {
  document.getElementById("connect_btn").disabled = false;
  document.getElementById("disconnect_btn").disabled = true;
  append_response("Disconnected");
}

/* This will be called when some error occurs.*/
ws.onError   = function(error) {
  // Use ProgrezzWS.StringifyError() to stringify the error.
  append_response("<span style='color: red'>" + ProgrezzWS.StringifyError(error) + "</span>");
}

/* This is the most important method! It will be called as a callback when the server respond us with some information. A JSON object should be recieved. */
ws.onMessage = function(msg_json) {
  try        { msg_json = JSON.stringify( msg_json ); }
  catch(err) { console.warn("Could not stringify."); }
  
  append_response( msg_json );
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
