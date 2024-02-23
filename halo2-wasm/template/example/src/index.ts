import { wrap } from "comlink";
import type {Halo2Benchmark} from "./worker";

const root = document.createElement("div");
document.body.appendChild(root);
root.innerHTML = "initializing";

const worker: Worker = new Worker(new URL("./worker.ts", import.meta.url), {
  name: "worker"
});

const workerAPI = wrap<Halo2Benchmark>(worker);

async function start() {
  root.innerHTML = `Result = '${await workerAPI.templateExample()}ms'`;
}

start();
