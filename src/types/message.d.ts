import mongoose from 'mongoose';
import { IMessageDetailsLean } from './messageDetails';

export interface IMessageSend {
  body: string;
  receiver: string;
  sender: string;
}

export interface IMessage extends IMessageLean, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IMessageLean extends IMessageSend {
  _id: string;
  owner: string;
  read: boolean;
}

export interface IMessageGet {
  page: number;
  message?: string;
}

export interface IMessageRead extends IMessageGet {
  message: string;
}

export interface IFullMessageLean extends IMessageLean {
  details: IMessageDetailsLean;
}

export interface IFullMessageRaw extends IMessageLean {
  details: IMessageDetailsLean[];
}

export interface INewMessage extends IMessageSend {
  owner: string;
}
