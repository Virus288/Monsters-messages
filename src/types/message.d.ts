import type mongoose from 'mongoose';
import type { IMessageEntity } from '../modules/messages/entity';
import type { ISendMessageDto } from '../modules/messages/dto';
import type { IMessageDetailsEntity } from '../modules/messagesDetails/entity';
import type { EMessageTargets } from '../enums';

export interface IMessage extends IMessageEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IFullMessageRaw extends IMessageEntity {
  details: IMessageDetailsEntity[];
}

export interface INewMessage extends ISendMessageDto {
  owner: string;
  type: EMessageTargets;
  chatId: string;
}
