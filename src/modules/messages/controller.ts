import type * as types from '../../types';
import Rooster from './rooster';
import Details from '../messagesDetails/controller';
import Validator from '../../validation';
import * as errors from '../../errors';

export default class Controller {
  private readonly _rooster: Rooster;
  private readonly _details: Details;

  constructor() {
    this._rooster = new Rooster();
    this._details = new Details();
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  private get details(): Details {
    return this._details;
  }

  async get(payload: types.IMessageGet, user: types.ILocalUser): Promise<types.IFullMessageLean[]> {
    Validator.validateGetMessage(user.tempId, payload);
    const { page } = payload;
    const { userId } = user;

    if (payload.message) return await this.rooster.getOneWithDetails(payload.message, userId);
    return await this.rooster.getWithDetails(userId, page);
  }

  async getUnread(payload: types.IMessageGet, user: types.ILocalUser): Promise<types.IFullMessageLean[]> {
    Validator.validateGetMessage(user.tempId, payload);
    const { page } = payload;
    const { userId } = user;

    return await this.rooster.getUnreadWithDetails(userId, page);
  }

  async send(payload: types.IMessageSend, user: types.ILocalUser): Promise<void> {
    Validator.validateNewMessage(user.tempId, payload);
    const { body, sender } = payload;

    const id = await this.details.add(body);
    await this.rooster.add({ ...payload, body: id.toString(), owner: sender });
  }

  async read(payload: types.IMessageRead, user: types.ILocalUser): Promise<void> {
    Validator.validateReadMessage(user.tempId, payload);
    const { message } = payload;

    const unread = await this.rooster.getOne(message);
    if (!unread || unread.length === 0) throw new errors.MissingMessage(user.tempId);
    await this.rooster.update(message, { read: true });
  }
}
