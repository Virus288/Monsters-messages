import type { EMessageTargets } from '../enums';
import type { IMessageEntity } from '../modules/messages/entity';
import type { ISendMessageDto } from '../modules/messages/send/types';
import type mongoose from 'mongoose';

export interface IMessage extends IMessageEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface INewMessage extends ISendMessageDto {
  owner: string;
  type: EMessageTargets;
  chatId: string;
}

export interface IUnreadMessage {
  lastMessage: number;
  unread: number;
  chatId: string;
  participants: string[];
}

export interface IPreparedMessagesBody {
  sender: string;
  receiver: string;
  messages: number;
}

export interface IPreparedMessages {
  type: EMessageTargets;
  messages: Record<string, IPreparedMessagesBody>;
}
