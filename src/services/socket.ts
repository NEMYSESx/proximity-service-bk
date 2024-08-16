import { Server, Socket } from "socket.io";

class SocketService {
  private _io: Server;
  private locations: { [key: string]: { lat: string; long: string } } = {};
  private orientations: { [key: string]: string } = {};

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
        async ({ lat, long }: { lat: string; long: string }) => {
          console.log("Getting the location from frontend", socket.id);
          this.locations[socket.id] = { lat, long }; // Update the data for the specific user

          // Send location data to all other clients
          socket.broadcast.emit("getLocation", {
            ...this.locations,
          });
          console.log(
            "Sending the location to all users except the senderr",
            this.locations
          );
        }
      );

      socket.on("sendOrientation", (alpha: string) => {
        this.orientations[socket.id] = alpha;

        // Send orientation data to all other clients
        socket.broadcast.emit("getOrientation", {
          ...this.orientations,
        });
      });

      console.log("hii");
      socket.on("disconnect", async () => {
        console.log("Socket disconnected", socket.id);
        delete this.locations[socket.id];
        delete this.orientations[socket.id];
        io.emit("getLocation", this.locations); //sending the data so that remaing clients can get it after disconnected
        io.emit("getOrientation", this.orientations);
      });
    });
  }
}

export default SocketService;
