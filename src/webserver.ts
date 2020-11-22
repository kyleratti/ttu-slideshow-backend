import express from "express";
import http from "http";
import WebSocket from "ws";
import { config } from ".";
import { MessageType, SocketMessage } from "./structures";

export class WebServer {
  private readonly app = express();
  private readonly port = Number(process.env.PORT || 45454);
  private server: http.Server;
  private wss: WebSocket.Server;
  private images: string[] = [];
  private watchDir: string;

  constructor() {
    this.watchDir = config.getValue<string>("watchDir");
  }

  private removeImage(image: string) {
    const index = this.images.indexOf(image);
    this.images.splice(index, 1);
  }

  broadcast(config: SocketMessage) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify(config));
    });
  }

  sendImageRemoved(image: string) {
    if (this.images.indexOf(image) !== -1) {
      this.removeImage(image);
    }

    return this.broadcast({ type: MessageType.Full, data: this.images });
  }

  sendImageAdded(image: string) {
    if (this.images.includes(image)) return;

    this.images.push(image);

    return this.broadcast({ type: MessageType.Full, data: this.images });
  }

  sendAll(ws: WebSocket) {
    return ws.send(
      JSON.stringify({
        type: MessageType.Full,
        data: this.images,
      })
    );
  }

  start() {
    this.app.use("/img/", express.static(this.watchDir));

    let server = http.createServer(this.app);
    this.server = server;
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws, req) => {
      console.log(`Client connected`, { req });
      this.sendAll(ws);
    });

    this.wss.on("error", (err, _) => {
      throw `WebSocket Error: ${err}`;
    });

    this.server.listen(this.port, () => {
      console.log(
        `Listening for HTTP requests on http://127.0.0.1:${this.port}`
      );

      console.log(`Watch Folder: ${this.watchDir}/`);

      console.warn("NOTE: _ONLY_ .jpg files will be detected");

      console.warn(
        "NOTE: Server is only listening for HTTP requests, _NOT_ HTTPS"
      );
    });
  }
}
