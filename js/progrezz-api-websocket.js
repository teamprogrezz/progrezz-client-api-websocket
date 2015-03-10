// ---------------------------
// -   Utilidad WebSocket    -
// ---------------------------

ProgrezzWS = function() {
  // Callbacks
  this.onMessage = null;
  this.onOpen  = null;
  this.onClose = null;
  this.onError = null;
  
  // Members
  this.opened = false;
  this.ws = null;      // WebSocket Object
  this.ws_uri = null;  // WebSocket URI
}

ProgrezzWS.DEFAULT = function() { };

// Constantes
ProgrezzWS.DEFAULT.REQUEST        = { type: "echo", data: { name: "world" } };
ProgrezzWS.DEFAULT.URL            = "/dev/api/websocket";
ProgrezzWS.DEFAULT.TYPE           = "json";

// Plantilla por defecto
ProgrezzWS.getTemplateRequest = function() {  
  return {
    type:    ProgrezzWS.DEFAULT.TYPE,   // Tipo por defecto
    request: ProgrezzWS.DEFAULT.REQUEST // Petición por defecto
  }
}

// Comprobar compatibilidad
ProgrezzWS.Compatible = function() {
  if (typeof window.WebSocket !== 'undefined')
    return true;
  
  if (typeof window.WebSocket !== 'undefined') {
    console.warn("Warning! Using window.MozWebSocket because window.WebSocket is not compatible.");
    window.WebSocket = window.MozWebSocket;
    
    return true;
  }

  return false;
}

// Stringificar error
// http://stackoverflow.com/questions/18803971/websocket-onerror-how-to-read-error-description
ProgrezzWS.StringifyError = function(event) {
  var error_str = "Error " + event.code + ": ";
  
  // See http://tools.ietf.org/html/rfc6455#section-7.4.1
  if (event.code == 1000)
    error_str += "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
  else if(event.code == 1001)
    error_str += "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
  else if(event.code == 1002)
    error_str += "An endpoint is terminating the connection due to a protocol error";
  else if(event.code == 1003)
    error_str += "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
  else if(event.code == 1004)
    error_str += "Reserved. The specific meaning might be defined in the future.";
  else if(event.code == 1005)
    error_str += "No status code was actually present.";
  else if(event.code == 1006)
    error_str += "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
  else if(event.code == 1007)
    error_str += "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
  else if(event.code == 1008)
    error_str += "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
  else if(event.code == 1009)
    error_str += "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
  else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
    error_str += "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
  else if(event.code == 1011)
    error_str += "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
  else if(event.code == 1015)
    error_str += "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  else
    error_str += "Unknown reason";
  
  return error_str;
}

// Función para iniciar
ProgrezzWS.prototype.open = function(url) {
  var self = this;
 
  if (!ProgrezzWS.Compatible()) {
    throw "Progrezz web-sockets not supported."
  }
  
  if (typeof url !== "undefined") this.ws_uri = url;
  else                            this.ws_uri = ProgrezzWS.DEFAULT.URL;
  
  this.ws = new WebSocket( url );
  
  this.ws.onopen    = function(event) { if (self.onOpen != null) self.onOpen(event); } 
  this.ws.onclose   = function(event) { this.ws = null; if (self.onClose != null) self.onClose(event); } 
  this.ws.onerror   = function(event) { if (self.onMessage != null) self.onError(event); }
  
  this.ws.onmessage = function(event) {
    var msg = event.data;
    
    if (typeof msg == "string") {
      try {
        msg = JSON.parse(msg);
      }
      catch(err) {
        console.warn("Warning: Not a json response.");
        console.warn(err)
      }
    }

    if (self.onMessage != null )
      self.onMessage( msg );
  }
  
  this.opened = true;
}

// Función para cerrar
ProgrezzWS.prototype.close = function() {
  if (this.ws == null)
    return;
  
  this.ws.close();
  this.ws = null;
}

// Función para enviar mensajes
ProgrezzWS.prototype.send = function( json_msg ) {
  if (this.ws == null)
    throw "Trying to send a message on an unopenned websocket. Please use 'open(...)'." 
  
  if( typeof json_msg !== "string" )
    json_msg = JSON.stringify(json_msg);
  
  this.ws.send( json_msg );
}
