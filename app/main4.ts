/** @format */
import * as net from "net";
import { readFileSync } from "fs";  // Refactor?
import { readFile } from "fs/promises";

// Terminating the Socket
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  // Opening the Socket
  socket.on("data", async (data) => {
    const request = data.toString();
    const method = request.split(" ")[0];
    const path = request.split(" ")[1];
    const content_type = "text/plain";

    // Default Response
    let response = "HTTP/1.1 404 Not Found\r\n\r\n";
    //Conditional Response - Path Starting-point
    if (path === "/") {
      response = "HTTP/1.1 200 OK\r\n\r\n";
    }
    //Conditional Response - Sub-paths
    if (path.startsWith("/echo/") && method === "GET") {
      const path_str = path.slice("/echo/".length);
      response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${path_str.length}\r\n\r\n${path_str}`;

      // Testing for User-Agent Header
    } else if (path === "/user-agent" && method === "GET") {
      const path_str = request
        .split("\r\n")
        .find((el) => el.toLowerCase().includes("user-agent:"))!
        .slice("user-agent:".length)
        .trim();
      response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${path_str.length}\r\n\r\n${path_str}`;

      // Testing for Files - Reading Method
    } else if (path.startsWith("/files/") && method === "GET") {
      const fileName = path.slice("/files/".length).trim();
      // const fileSize = statSync('tmp/'+fileName).size;
      try {
        const fileContent = await readFile(process.argv[3] + fileName);
        response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`;
      } catch {
        response = `HTTP/1.1 404 Not Found\r\n\r\n`;
      }
      // Testing for Files - Writing Method
    } else if (path.startsWith("/files/") && method === "POST") {
      console.log("hello");
      response = `HTTP/1.1 201 Created\r\n\r\n`;
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
