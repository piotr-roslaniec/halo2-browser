import {wrap} from "comlink";
import type {Halo2Benchmark} from "./worker";

const root = document.createElement("div");
document.body.appendChild(root);
root.innerHTML = "initializing";

const worker: Worker = new Worker(new URL("./worker.ts", import.meta.url), {
    name: "worker"
});

const workerAPI = wrap<Halo2Benchmark>(worker);

async function start() {
    root.innerHTML = "running...";

    // Settings
    const iterations = 200; // More than 2_000 crashes WASM
    const num_runs = 10; // Running just 10x200 iterations, to avoid crashing WASM
    const threads = 4;


    const results = [];
    for (let i = 0; i < num_runs; i++) {
        console.log(`Iteration ${i}`);
        const result = await workerAPI.templateExample(iterations);
        console.log(`Result ${i} = ${result}ms`);
        results.push(result);
    }
    const average = results.reduce((a, b) => a + b, 0) / results.length;
    console.log(`Average = ${average}ms`);

    const resultsHtml = results.map((r, i) => `<div>Run ${i}: ${r}ms</div>`).join("");
    let settingsHtml = `<div>Iterations: ${iterations}</div><div>Runs: ${num_runs}</div>`;
    if (threads) {
        settingsHtml += `<div>Threads: ${threads}</div>`;
    }
    const averageHtml = `<div>Average: ${average}ms</div>`;
    root.innerHTML = settingsHtml + averageHtml + resultsHtml;
}

start();
