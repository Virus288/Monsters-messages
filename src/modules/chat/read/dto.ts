import Validation from '../../../tools/validation';
import type { IReadChatMessageDto } from './types';

export default class ReadChatMessageDto implements IReadChatMessageDto {
  chatId: string;
  user: string;

  constructor(data: IReadChatMessageDto) {
    this.chatId = data.chatId;
    this.user = data.user;

    this.validate();
  }

  private validate(): void {
    new Validation(this.chatId, 'chatId').isDefined().isString().isObjectId();
    new Validation(this.user, 'user').isDefined().isString().isObjectId();
  }
}
