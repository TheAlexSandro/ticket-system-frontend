import { io, Socket } from "socket.io-client";
import { useRuntimeConfig } from "nuxt/app";

let socket: Socket | null = null;

export function useSocket() {
  const config = useRuntimeConfig();

  if (!socket) {
    socket = io(String(config.public["BACKEND_URL"]), {
      transports: ["websocket"],
    });
  }

  return socket;
}
