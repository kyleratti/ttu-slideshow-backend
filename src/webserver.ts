import express from "express";
import fs from "fs";
import http from "http";
import { resolve } from "path";
import WebSocket from "ws";
import { MessageType, SocketMessage } from "./structures";

export class WebServer {
  private readonly app = express();
  private readonly port = Number(process.env.PORT || 45454);
  private server: http.Server;
  private wss: WebSocket.Server;
  private images: string[] = [];

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

    return this.broadcast({
      type: MessageType.DeleteImage,
      data: image,
    });
  }

  sendImageAdded(image: string) {
    this.images.push(image);

    return this.broadcast({
      type: MessageType.NewImage,
      data: image,
    });
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
    this.app.use("/img/", express.static(process.env.WATCH_DIR));

    const packagesDir = resolve(process.env.PACKAGES_DIR);

    if (!packagesDir) throw `Environment variable PACKAGES_DIR is not set`;

    if (!fs.existsSync(packagesDir))
      throw `PACKAGES_DIR does not exist!! ${packagesDir}`;

    const distDir = resolve(packagesDir, "ttu-slideshow-frontend/dist/");

    if (!fs.existsSync(distDir))
      throw `Production frontend not found (do you need to run install/update?): ${distDir}`;

    console.log(`Production detected; serving '${distDir}'`);
    this.app.use("/", express.static(distDir));

    let server = http.createServer(this.app);
    this.server = server;
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      this.sendAll(ws);
    });

    this.wss.on("error", (err, _) => {
      throw `WebSocket Error: ${err}`;
    });

    this.server.listen(this.port, () => {
      console.log(
        `Listening for HTTP requests on http://127.0.0.1:${this.port}`
      );
      console.log(`Open this address in your web browser`);

      console.log(
        `NOTE: Server is only listening for HTTP requests, _NOT_ HTTPS`
      );
    });
  }
}
