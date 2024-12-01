import express from 'express';
import { Worker } from 'node:worker_threads';


const port = 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n);
    if (isNaN(n) || n < 0) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    
    const worker = new Worker('./dist/worker.js', { workerData: n });
    
    worker.on('message', (result) => {
        res.json({ sum: result });
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});

app.listen(port,()=>{
    console.log(process.pid + "is listening to port: " + port)
})


