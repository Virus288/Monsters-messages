import GetChatMessageDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import { formGetMessages, formUnreadMessages } from '../../messages/utils';
import Rooster from '../rooster';
import type { IGetChatMessageDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IPreparedMessagesBody, IUnreadMessage } from '../../../types';
import type { IFullChatMessageEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Chat> {
  constructor() {
    super(new Rooster());
  }

  async get(
    data: IGetChatMessageDto,
    userId: string,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullChatMessageEntity[]> {
    const payload = new GetChatMessageDto(data);
    const { page } = payload;

    if (payload.target) return this.rooster.getWithDetails(payload.target, page);
    const messages = await this.rooster.get(userId, page);
    if (!messages || messages.length === 0) return {};
    return formGetMessages(messages);
  }

  async getUnread(data: IGetChatMessageDto, userId: string): Promise<IUnreadMessage[]> {
    const payload = new GetChatMessageDto(data);
    const { page } = payload;

    const messages = await this.rooster.getUnread(userId, page);
    return formUnreadMessages(messages, userId);
  }
}
