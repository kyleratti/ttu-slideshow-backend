import fs from "fs";
import path from "path";
import { Config } from "./config";
import { Watcher } from "./watchers";
import { WebServer } from "./webserver";

export const config = new Config();
config.load();

let watchDir = config.getValue<string>("watchDir");

if (!fs.existsSync(watchDir))
  throw `Unable to watch directory (does not exist or no access): ${watchDir}`;

watchDir = path.resolve(watchDir);

export const webServer = new WebServer();
const watcher = new Watcher();

function run() {
  try {
    webServer.start();
  } catch (e) {
    throw `Fatal error starting webserver: ${e}`;
  }

  watcher.start();
}

run();
