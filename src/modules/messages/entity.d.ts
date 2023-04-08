import type { ISendMessageDto } from './dto';
import type { EMessageTargets } from '../../enums';
import type { IMessageDetailsEntity } from '../messagesDetails/entity';

export interface IMessageEntity extends ISendMessageDto {
  _id: string;
  owner: string;
  read: boolean;
  modified: number;
  type: EMessageTargets;
  chatId: string;
}

export interface IFullMessageEntity extends IMessageEntity {
  details: IMessageDetailsEntity;
}
