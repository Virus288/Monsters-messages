import GetController from './get';
import ReadController from './read';
import SendController from './send';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IGetMessageDto } from './get/types';
import type { IReadMessageDto } from './read/types';
import type { ISendMessageDto } from './send/types';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class UserHandler extends HandlerFactory<EModules.Messages> {
  private readonly _sendController: SendController;
  private readonly _readController: ReadController;

  constructor() {
    super(new GetController());
    this._sendController = new SendController();
    this._readController = new ReadController();
  }

  private get sendController(): SendController {
    return this._sendController;
  }

  private get readController(): ReadController {
    return this._readController;
  }

  async get(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.getController.get(payload as IGetMessageDto, user.userId);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async getUnread(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.getController.getUnread(payload as IGetMessageDto, user.userId);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async send(payload: unknown, user: ILocalUser): Promise<void> {
    await this.sendController.send(payload as ISendMessageDto, user.userId);
    return State.broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async read(payload: unknown, user: ILocalUser): Promise<void> {
    await this.readController.read(payload as IReadMessageDto);
    return State.broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
