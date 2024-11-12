import { app } from "./app.js ";
import { dbConnect } from "./src/db/dbConnect.js"
import startWebSocketServer from './websocket.js '



dbConnect()
    .then(() => {
        app.listen(3000, () => {
            console.log("DC_InfraSight Server is running on Port 3000")
            startWebSocketServer();
            
        })
    })

   