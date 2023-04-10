import type MessagesController from '../../modules/messages/controller';
import type ChatController from '../../modules/chat/controller';
import type MessagesRooster from '../../modules/messages/rooster';
import type DetailsRooster from '../../modules/messagesDetails/rooster';
import type ChatRooster from '../../modules/chat/rooster';
import type { EModules } from './enums';
import type { IFullMessageEntity } from '../../modules/messages/entity';
import type { ISendMessageDto } from '../../modules/messages/dto';
import type { IMessageDetailsEntity } from '../../modules/messagesDetails/entity';

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
