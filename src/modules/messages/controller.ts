import Rooster from './rooster';
import Details from '../messagesDetails/controller';
import * as errors from '../../errors';
import Validator from './validation';
import type { IFullMessageEntity, IGetMessageEntity } from './entity';
import type { IGetMessageDto, IReadMessageDto, ISendMessageDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import type { EMessageTargets } from '../../enums';
import mongoose from 'mongoose';
import { formGetMessages, formUnreadMessages } from './utils';
import type { IPreparedMessagesBody, IUnreadMessage } from '../../types';

export default class Controller extends ControllerFactory<EModules.Messages> {
  private readonly _details: Details;

  constructor() {
    super(new Rooster());
    this._details = new Details();
  }

  private get details(): Details {
    return this._details;
  }

  async get(
    payload: IGetMessageDto,
    userId: string,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullMessageEntity[]> {
    Validator.validateGetMessage(payload);
    const { page } = payload;

    if (payload.target) return this.rooster.getWithDetails(payload.target, page);
    const messages = await this.rooster.get(userId, page);
    return formGetMessages(messages);
  }

  async test(userId: string): Promise<IGetMessageEntity[]> {
    return this.rooster.get(userId, 1);
  }

  async getUnread(payload: IGetMessageDto, type: EMessageTargets, userId: string): Promise<IUnreadMessage[]> {
    Validator.validateGetMessage(payload);
    const { page } = payload;

    const messages = await this.rooster.getUnread(userId, type, page);
    return formUnreadMessages(messages, userId);
  }

  async send(payload: ISendMessageDto, type: EMessageTargets): Promise<void> {
    Validator.validateNewMessage(payload);
    const { body, sender, receiver } = payload;

    let convId = new mongoose.Types.ObjectId().toString();
    const chatExist = await this.rooster.getOne(sender, receiver);
    if (chatExist) convId = chatExist.chatId;

    const id = await this.details.add(body);
    await this.rooster.add({ ...payload, body: id.toString(), owner: sender, type, chatId: convId });
  }

  async read(payload: IReadMessageDto): Promise<void> {
    Validator.validateReadMessage(payload);
    const { chatId, user } = payload;

    const unread = await this.rooster.getOneByChatId(chatId, user);
    if (!unread) throw new errors.MissingMessageError();
    if (unread.read) throw new errors.MessageAlreadyRead();

    await this.rooster.update(unread.chatId, unread.sender, { read: true });
  }
}
