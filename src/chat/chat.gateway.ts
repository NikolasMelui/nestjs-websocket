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
    this.logger.log(`Chat-to-client ${client.id} message: ${message}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: ChatRoom) {
    client.join(room);
    this.wss.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: ChatRoom) {
    client.leave(room);
    this.wss.emit('leftRoom', room);
  }
}
