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
import { ChatToClientMessageDto } from './chat-to-client-message.dto';
import { ChatToServerMessageDto } from './chat-to-server-message.dto';

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
  handleMessage(client: Socket, message: ChatToServerMessageDto) {
    const toClientMessage: ChatToClientMessageDto = message;
    this.wss.emit('chatToClient', toClientMessage);
    this.logger.log(`Chat-to-client ${client.id} message: ${toClientMessage}`);
  }
}
