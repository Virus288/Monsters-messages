import * as enums from '../enums';
import * as errors from '../errors';
import ChatController from '../modules/chat/handler';
import MessagesController from '../modules/messages/handler';
import type * as types from '../types';

export default class Router {
  private readonly _messages: MessagesController;
  private readonly _chat: ChatController;

  constructor() {
    this._messages = new MessagesController();
    this._chat = new ChatController();
  }

  private get messages(): MessagesController {
    return this._messages;
  }

  private get chat(): ChatController {
    return this._chat;
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
        return this.messages.getUnread(payload.payload, payload.user);
      case enums.EMessagesTargets.Send:
        return this.messages.send(payload.payload, payload.user);
      case enums.EMessagesTargets.Read:
        return this.messages.read(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async chatMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EMessagesTargets.Get:
        return this.chat.get(payload.payload, payload.user);
      case enums.EMessagesTargets.GetUnread:
        return this.chat.getUnread(payload.payload, payload.user);
      case enums.EMessagesTargets.Send:
        return this.chat.send(payload.payload, payload.user);
      case enums.EMessagesTargets.Read:
        return this.chat.read(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
