import { createServer } from "http";
import SocketService from "./services/socket";

async function init() {
  const httpServer = createServer();
  const PORT = 8000;

  const socketService = new SocketService();
  socketService.io.attach(httpServer);
  socketService.initListeners();

  httpServer.listen(PORT, () => {
    console.log("server is running...");
  });
}

init();
