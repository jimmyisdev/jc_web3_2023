class Socket {
    socket: null | WebSocket;
    constructor() {
        this.socket = null;
    }
    connect(url: string) {
        if (!this.socket) {
            this.socket = new WebSocket(url);
        }
    }
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
    on(eventName: string, callback: (event: MessageEvent) => void): void {
        if (this.socket) {
            this.socket.addEventListener(eventName, callback as EventListener);
        }
    }
}
export { Socket };