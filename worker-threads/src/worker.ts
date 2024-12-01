import { parentPort, workerData } from 'worker_threads';

function sum(n:number) {
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
        count += i;
    }

    return count
}

const result = sum(workerData);
if(parentPort)parentPort.postMessage(result);
