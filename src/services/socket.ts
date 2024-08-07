import { Server, Socket } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Initializing socket...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public get io(): Server {
    return this._io;
  }

  public initListeners(): void {
    const io = this._io;
    console.log("Init socket listeners");

    io.on("connect", (socket: Socket) => {
      console.log("New socket connected", socket.id);

      socket.on(
        "sendLocation",
        ({ lat, long }: { lat: string; long: string }) => {
          console.log("Getting the location from frontend", socket.id);
          io.emit("getLocation", [{ lat, long }]);
          console.log("sending the location to the frontend of all users");
        }
      );

      socket.on("sendOrientation", (alpha: string) => {
        io.emit("getOrientation", [{ alpha }]);
      });
      console.log("hii");
      socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
      });
    });
  }
}

export default SocketService;
