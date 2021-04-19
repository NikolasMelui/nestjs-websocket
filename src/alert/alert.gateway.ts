import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AlertToClientDto } from './alert-to-client.type';

@WebSocketGateway({ namespace: '/alert' })
export class AlertGateway {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AlertGateway');

  sendToAll(message: string): void {
    const alertToClient: AlertToClientDto = { type: 'Alert', message };
    this.wss.emit('alertToClient', alertToClient);
    this.logger.log(`Alert-to-client: ${alertToClient}`);
  }
}
