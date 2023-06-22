import ReadChatMessageDto from './dto';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IReadMessageDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Messages> {
  constructor() {
    super(new Rooster());
  }

  async read(data: IReadMessageDto): Promise<void> {
    const payload = new ReadChatMessageDto(data);
    const { chatId, user } = payload;

    const unread = await this.rooster.getOneByChatId(chatId, user);
    if (!unread) throw new errors.MissingMessageError();
    if (unread.read) throw new errors.MessageAlreadyRead();

    await this.rooster.update(unread.chatId, unread.sender, { read: true });
  }
}
