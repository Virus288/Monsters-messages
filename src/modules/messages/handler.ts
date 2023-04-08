import State from '../../tools/state';
import type { EMessageTargets } from '../../enums';
import * as enums from '../../enums';
import type { ILocalUser } from '../../types';
import HandlerFactory from '../../tools/abstract/handler';
import type { EModules } from '../../tools/abstract/enums';
import Controller from './controller';
import type { IGetMessageDto, IReadMessageDto, ISendMessageDto } from './dto';

export default class UserHandler extends HandlerFactory<EModules.Messages> {
  constructor() {
    super(new Controller());
  }

  async get(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.controller.get(payload as IGetMessageDto, user.userId);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async getUnread(payload: unknown, type: EMessageTargets, user: ILocalUser): Promise<void> {
    const data = await this.controller.getUnread(payload as IGetMessageDto, type, user.userId);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async send(payload: unknown, type: EMessageTargets, user: ILocalUser): Promise<void> {
    await this.controller.send(payload as ISendMessageDto, type);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async read(payload: unknown, user: ILocalUser): Promise<void> {
    await this.controller.read(payload as IReadMessageDto);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
