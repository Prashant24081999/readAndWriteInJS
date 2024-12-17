const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    fs.readFile("message.txt", (err, data) => {
      res.statusCode = 200;
      let savedMessage = err ? "" : data;
      res.setHeader("Content-Type", "text/html");

      res.end(
        `
                <h3>${savedMessage}</h3>
                <form action='/message' method='POST'>
                    <input type='text' name='msg' id='msg'/>
                    <button type='submit'>Send</button>
                </form>    
                `
      );
    });
  } else if (req.url === "/message" && req.method === "POST") {
    let dataChunks = [];
    req.on("data", (chunk) => {
      dataChunks.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(dataChunks).toString();
      let message = data.split("=")[1];
      console.log("Received message: ", message);

      fs.writeFile("message.txt", message, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end("Failed to save the message");
        } else {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          res.end();
        }
      });
    });
  } else if (req.url === "/read" && req.method === "GET") {
    fs.readFile("message.txt", (err, data) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(
        `
                <h3>${data}</h3>
                `
      );
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running");
});
