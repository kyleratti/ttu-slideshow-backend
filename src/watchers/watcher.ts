import chokidar from "chokidar";
import path from "path";
import { webServer } from "..";

export class Watcher {
  private readonly watchDir: string;
  private watcher: chokidar.FSWatcher;

  constructor(watchDir: string) {
    this.watchDir = watchDir;
  }

  private onFileAdded(file: string) {
    const filename = path.parse(file).base;
    webServer.sendImageAdded(filename);
    console.log(`added: '${filename}'`);
  }

  private onFileRemoved(file: string) {
    const filename = path.parse(file).base;
    webServer.sendImageRemoved(filename);
    console.log(`removed: '${filename}'`);
  }

  start() {
    let watcher = chokidar.watch(`${this.watchDir}/*.jpg`);
    watcher.on("add", this.onFileAdded);
    watcher.on("unlink", this.onFileRemoved);
    watcher.on("error", err => {
      console.error(`Error while watching '${this.watchDir}': ${err}`);
    });

    this.watcher = watcher;
  }
}
