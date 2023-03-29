import Rooster from './rooster';
import Details from '../messagesDetails/controller';
import * as errors from '../../errors';
import Validator from './validation';
import type { IFullMessageEntity } from './entity';
import type { IGetMessageDto, IReadMessageDto, ISendMessageDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Messages> {
  private readonly _details: Details;

  constructor() {
    super(new Rooster());
    this._details = new Details();
  }

  private get details(): Details {
    return this._details;
  }

  async get(payload: IGetMessageDto, userId: string): Promise<IFullMessageEntity[]> {
    Validator.validateGetMessage(payload);
    const { page } = payload;

    if (payload.message) return this.rooster.getOneWithDetails(payload.message, userId);
    return this.rooster.getWithDetails(userId, page);
  }

  async getUnread(payload: IGetMessageDto, userId: string): Promise<IFullMessageEntity[]> {
    Validator.validateGetMessage(payload);
    const { page } = payload;

    return this.rooster.getUnreadWithDetails(userId, page);
  }

  async send(payload: ISendMessageDto): Promise<void> {
    Validator.validateNewMessage(payload);
    const { body, sender } = payload;

    const id = await this.details.add(body);
    await this.rooster.add({ ...payload, body: id.toString(), owner: sender });
  }

  async read(payload: IReadMessageDto): Promise<void> {
    Validator.validateReadMessage(payload);
    const { message } = payload;

    const unread = await this.rooster.getOne(message);
    if (!unread) throw new errors.MissingMessageError();
    await this.rooster.update(message, { read: true });
  }
}
