import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  static count: number = 0

  @WebSocketServer()
  wss: Server;

  findIPAddress(client: Socket) {
    const ip = client.handshake.address.split(':');
    const address = ip[ip.length - 1];
    return address
  }

  afterInit(server: Server) {
    console.log('connected to socket');
  }

  //function that happenes on connection
  handleConnection(client: Socket) {
    const address = this.findIPAddress(client);
    client.emit('connected', {ip : address})
    this.wss.emit("received_connect", { ip: address, id: SocketGateway.count, action: "connect" })
    SocketGateway.count++
    console.log('connected with user: ', client.id, new Date(), "IP----", address);
  }

  handleDisconnect(client: Socket) {
    const address = this.findIPAddress(client);
    this.wss.emit("received_disconnect", { ip: address, id: SocketGateway.count, action: "disconnect" })
    SocketGateway.count++
    console.log('disconnected with user: ', client.id);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(client: Socket, { sender, content, date }) {
    this.wss.emit("received_message", { ip: this.findIPAddress(client), sender, content, date, id: SocketGateway.count });
    SocketGateway.count++
    return;
  }
}
