import { ChatRoom } from './chat-room.enum';

export class ChatMessageDto {
  sender: string;
  room: ChatRoom;
  message: string;
}
