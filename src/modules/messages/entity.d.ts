import type { ISendMessageDto } from './send/types';
import type { EMessageTargets } from '../../enums';
import type mongoose from 'mongoose';

export interface IMessageEntity extends ISendMessageDto {
  _id: string;
  read: boolean;
  type: EMessageTargets;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFullMessageEntity {
  sender: string;
  receiver: string;
  read: boolean;
  chatId: string;
  message: string;
}

export interface IGetMessageEntity {
  sender: string;
  receiver: string;
  type: EMessageTargets;
  chatId: string;
}

export interface IUnreadMessageEntity {
  chatId: string;
  sender: string;
  receiver: string;
  createdAt: string;
}

export interface IGetOneMessageEntity {
  read: boolean;
  chatId: string;
  sender: string;
}

export interface IFullMessage extends IFullMessageEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
