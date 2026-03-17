const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const emitter = new Sales();

emitter.on("newSale", () => {
  console.log("There was a new sale.");
});

emitter.on("newSale", () => {
  console.log("The customer name is: Michael");
});

emitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in the stock.`);
});

emitter.emit("newSale", 10);
console.log(
  "////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"
);
/////////////////////////////////////////////////////////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request received");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening for requests...");
});
