import dotenv from "dotenv";
import fs from "fs";
import { Watcher } from "./watchers";
import { WebServer } from "./webserver";

dotenv.config();

const watchDir = String(process.env.WATCH_DIR);

export const webServer = new WebServer();
export const watcher = new Watcher(watchDir);

function run() {
  try {
    webServer.start();
  } catch (e) {
    throw `Fatal error starting webserver: ${e}`;
  }

  if (fs.existsSync(watchDir)) {
    watcher.start();
  } else {
    throw `Unable to watch directory (not found): ${watchDir}`;
  }
}

run();
