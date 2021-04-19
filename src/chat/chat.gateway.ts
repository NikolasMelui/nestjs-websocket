import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto } from './chat-message.dto';
import { ChatRoom } from './chat-room.enum';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Server has been initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: ChatMessageDto) {
    this.wss.to(message.room).emit('chatToClient', message);
    this.logger.log(
      `Client ${client.id} chat-to-client message: ${JSON.stringify(message)}`,
    );
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: ChatRoom) {
    client.join(room);
    client.emit('joinedRoom', room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: ChatRoom) {
    client.leave(room);
    client.emit('leftRoom', room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
  }
}
