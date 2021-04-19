import { ChatRoom } from './chat-room.enum';

export class ChatMessageDto {
  sender: string;
  message: string;
  room: ChatRoom;
}
