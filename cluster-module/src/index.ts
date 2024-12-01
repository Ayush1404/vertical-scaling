import { cpus } from 'os'
import cluster from 'cluster'
import express from 'express';

const port = 3000;

if(cluster.isPrimary)
{
    const cores = cpus().length;
    console.log("This is main process pid: " , process.pid);
    
    for(let i=0;i<cores;i++){
        cluster.fork();
    }

    cluster.on('exit',(worker,code,signal)=>{
        console.log(worker.process.pid + " died")
        console.log("starting another thread ...")
        cluster.fork()
    })
}
else{
    const app = express();

    console.log(`Worker ${process.pid} started`);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.get("/api/:n", function (req, res) {
        let n = parseInt(req.params.n);
        let count = 0;

        if (n > 5000000000) n = 5000000000;

        for (let i = 0; i <= n; i++) {
        count += i;
        }

        res.send(`Final count is ${count} ${process.pid}`);
    });

    app.listen(port,()=>{
        console.log(process.pid + "is listening to port: " + port)
    })
}