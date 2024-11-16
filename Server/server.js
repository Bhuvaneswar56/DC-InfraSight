import { app } from "./app.js ";
import { dbConnect } from "./src/db/dbConnect.js";
import { startWebSocketServer } from './websocket.js';
import { agenda } from './src/utils/Agenda.js'



dbConnect()
    .then(async () => {
        app.listen(3000, () => {
            console.log("DC_InfraSight Server is running on Port 3000")
            startWebSocketServer();
        });

        await agenda.start();
        console.log("Agenda has started.");
    })

