import type MessagesController from '../../modules/messages/controller';
import type MessagesRooster from '../../modules/messages/rooster';
import type DetailsRooster from '../../modules/messagesDetails/rooster';
import type { EModules } from './enums';
import type { IFullMessageEntity } from '../../modules/messages/entity';
import type { ISendMessageDto } from '../../modules/messages/dto';
import type { IMessageDetailsEntity } from '../../modules/messagesDetails/entity';

export interface IModulesHandlers {
  [EModules.Messages]: MessagesController;
}

export interface IModulesControllers {
  [EModules.Messages]: MessagesRooster;
  [EModules.MessageDetails]: DetailsRooster;
}

export interface IRoosterAddData {
  [EModules.Messages]: ISendMessageDto;
  [EModules.MessageDetails]: string;
}

export interface IRoosterGetData {
  [EModules.Messages]: IFullMessageEntity[];
  [EModules.MessageDetails]: IMessageDetailsEntity;
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<void>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
