import type * as types from '../types';
import * as enums from '../enums';
import { EMessageTargets } from '../enums';
import * as errors from '../errors';
import MessagesController from '../modules/messages/handler';

export default class Router {
  private readonly _messages: MessagesController;

  constructor() {
    this._messages = new MessagesController();
  }

  private get messages(): MessagesController {
    return this._messages;
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EMessageTargets.Messages:
        return this.messagesMessage(payload);
      case enums.EMessageTargets.Chat:
        return this.chatMessage(payload);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async messagesMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EMessagesTargets.Get:
        return this.messages.get(payload.payload, payload.user);
      case enums.EMessagesTargets.GetUnread:
        return this.messages.getUnread(payload.payload, EMessageTargets.Messages, payload.user);
      case enums.EMessagesTargets.Send:
        return this.messages.send(payload.payload, EMessageTargets.Messages, payload.user);
      case enums.EMessagesTargets.Read:
        return this.messages.read(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async chatMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EMessagesTargets.Get:
        return this.messages.get(payload.payload, payload.user);
      case enums.EMessagesTargets.GetUnread:
        return this.messages.getUnread(payload.payload, EMessageTargets.Chat, payload.user);
      case enums.EMessagesTargets.Send:
        return this.messages.send(payload.payload, EMessageTargets.Chat, payload.user);
      case enums.EMessagesTargets.Read:
        return this.messages.read(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
