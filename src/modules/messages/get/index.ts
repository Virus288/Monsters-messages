import GetChatMessageDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Message from '../model';
import Rooster from '../rooster';
import { formGetMessages, formUnreadMessages } from '../utils';
import type { IGetMessageDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IPreparedMessagesBody, IUnreadMessage } from '../../../types';
import type { IFullMessageEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Messages> {
  constructor() {
    super(new Rooster(Message));
  }

  async get(
    data: IGetMessageDto,
    userId: string,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullMessageEntity[]> {
    const payload = new GetChatMessageDto(data);
    const { page } = payload;

    if (payload.target) return this.rooster.getWithDetails(payload.target, page);
    const messages = await this.rooster.getByOwner(userId, page);
    if (!messages || messages.length === 0) return {};
    return formGetMessages(messages);
  }

  async getUnread(data: IGetMessageDto, userId: string): Promise<IUnreadMessage[]> {
    const payload = new GetChatMessageDto(data);
    const { page } = payload;

    const messages = await this.rooster.getUnread(userId, page);
    return formUnreadMessages(messages, userId);
  }
}
