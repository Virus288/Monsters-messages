import type { ISendChatMessageDto } from './send/types';
import type { EMessageTargets } from '../../enums';
import type mongoose from 'mongoose';

export interface IChatMessageEntity extends ISendChatMessageDto {
  _id: string;
  read: boolean;
  type: EMessageTargets;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFullChatMessageEntity {
  sender: string;
  receiver: string;
  read: boolean;
  chatId: string;
  message: string;
}

export interface IGetChatMessageEntity {
  sender: string;
  receiver: string;
  type: EMessageTargets;
  chatId: string;
}

export interface IUnreadChatMessageEntity {
  chatId: string;
  sender: string;
  receiver: string;
  createdAt: string;
}

export interface IGetOneChatMessageEntity {
  read: boolean;
  chatId: string;
  sender: string;
}

export interface IChatMessage extends IChatMessageEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
