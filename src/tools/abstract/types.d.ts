import type { EModules } from './enums';
import type ChatController from '../../modules/chat/get';
import type ChatRooster from '../../modules/chat/rooster';
import type { ISendMessageDto } from '../../modules/messages/dto';
import type { IFullMessageEntity } from '../../modules/messages/entity';
import type MessagesController from '../../modules/messages/get/';
import type MessagesRooster from '../../modules/messages/rooster';
import type { IMessageDetailsEntity } from '../../modules/messagesDetails/entity';
import type DetailsRooster from '../../modules/messagesDetails/rooster';

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
  [EModules.MessageDetails]: string;
  [EModules.Chat]: ISendMessageDto;
}

export interface IRoosterGetData {
  [EModules.Messages]: IFullMessageEntity[];
  [EModules.MessageDetails]: IMessageDetailsEntity;
  [EModules.Chat]: IFullMessageEntity;
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<void>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
