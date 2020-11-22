import fs from "fs";

type ConfigMap = {
  [key: string]: object;
};

export class Config {
  private values: ConfigMap = {};

  public getValue = <T extends unknown>(key: string) => this.values[key] as T;

  public load = () => {
    if (!fs.existsSync("./config.json")) throw `config.json missing`;

    const data = JSON.parse(fs.readFileSync("./config.json").toString());

    Object.keys(data).forEach((key) => (this.values[key] = data[key]));
  };
}
