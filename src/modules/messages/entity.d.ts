import type { ISendMessageDto } from './dto';
import type { IMessageDetailsLean } from '../../types';

export interface IMessageEntity extends ISendMessageDto {
  _id: string;
  owner: string;
  read: boolean;
}

export interface IFullMessageEntity extends IMessageEntity {
  details: IMessageDetailsLean;
}
