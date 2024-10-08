/** @format */

import * as net from "net";
import { readFileSync, statSync } from "fs";

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  // Opening the Socket

  socket.on("data", (data) => {
    const request = data.toString();
    const path = request.split(" ")[1];
    const content_type = "text/plain";
    // Default Response
    let response = "HTTP/1.1 404 Not Found\r\n\r\n";
    //Conditional Responses
    if (path === "/") {
      response = "HTTP/1.1 200 OK\r\n\r\n";
    }
    if (path.startsWith("/echo/")) {
      const str = path.slice("/echo/".length);
      // console.log(path);
      // console.log(str);
      response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`;
    }

    // Testing for User-Agent
    if (path === "/user-agent") {
      const str = request
        .split("\r\n")
        .find((el) => el.toLowerCase().includes("user-agent:"))!
        .slice("user-agent:".length)
        .trim();
      response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`;
    }

    // Testing for Files
    if (path.startsWith("/files/")) {
      const fileName = path.slice("/files/".length).trim();
      const fileSize = statSync(process.argv[3] + fileName).size;
      const fileContent = readFileSync(process.argv[3] + fileName);
      response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileSize}\r\n\r\n${fileContent}`;
    }

    socket.write(response);
    socket.end();
  });
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Initial Stage

server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
