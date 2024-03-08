import type { EModules } from './enums';
import type ChatController from '../../modules/chat/get';
import type ChatRooster from '../../modules/chat/rooster';
import type { ISendMessageDto } from '../../modules/messages/dto';
import type { IFullMessageEntity, IGetMessageEntity } from '../../modules/messages/entity';
import type MessagesController from '../../modules/messages/get/';
import type MessagesRooster from '../../modules/messages/rooster';
import type { IMessageDetailsEntity } from '../../modules/messagesDetails/entity';
import type DetailsRooster from '../../modules/messagesDetails/rooster';
import type { IMessageDetailsDto } from '../../modules/messagesDetails/types';

export interface IModulesHandlers {
  [EModules.Messages]: MessagesController;
  [EModules.Chat]: ChatController;
}

export interface IModulesControllers {
  [EModules.Messages]: MessagesRooster;
  [EModules.MessageDetails]: DetailsRooster;
  [EModules.Chat]: ChatRooster;
}

export interface IRoosterAddData {
  [EModules.Messages]: ISendMessageDto;
  [EModules.MessageDetails]: IMessageDetailsDto;
  [EModules.Chat]: ISendMessageDto;
}

export interface IRoosterGetData {
  [EModules.Messages]: IGetMessageEntity[];
  [EModules.MessageDetails]: IMessageDetailsEntity;
  [EModules.Chat]: IFullMessageEntity;
}

export interface IRoosterGetInData {
  [EModules.Messages]: IGetMessageEntity[];
  [EModules.MessageDetails]: IMessageDetailsEntity[];
  [EModules.Chat]: IFullMessageEntity[];
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z] | null>;
}
