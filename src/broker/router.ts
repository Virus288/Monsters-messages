import type * as types from '../types';
import * as enums from '../enums';
import * as errors from '../errors';
import Messages from '../modules/messages/controller';
import State from '../tools/state';

export default class Router {
  private readonly _messages: Messages;

  constructor() {
    this._messages = new Messages();
  }

  private get messages(): Messages {
    return this._messages;
  }

  async handleMessage(data: types.IRabbitMessage): Promise<void> {
    const { user, payload, target } = data;

    switch (target) {
      case enums.EMessagesTargets.Get:
        return await this.get(payload, user);
      case enums.EMessagesTargets.GetUnread:
        return await this.getUnread(payload, user);
      case enums.EMessagesTargets.Send:
        return await this.send(payload, user);
      case enums.EMessagesTargets.Read:
        return await this.read(payload, user);
      default:
        throw new errors.WrongType(user.tempId);
    }
  }

  private async get(payload: unknown, user: types.ILocalUser): Promise<void> {
    const data = await this.messages.get(payload as types.IMessageGet, user);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  private async getUnread(payload: unknown, user: types.ILocalUser): Promise<void> {
    const data = await this.messages.getUnread(payload as types.IMessageGet, user);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  private async send(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.messages.send(payload as types.IMessageSend, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  private async read(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.messages.read(payload as types.IMessageRead, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
