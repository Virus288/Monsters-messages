import Validation from '../../../tools/validation';
import type { ISendChatMessageDto } from './types';

export default class SendChatMessageDto implements ISendChatMessageDto {
  body: string;
  receiver: string;
  sender: string;

  constructor(data: ISendChatMessageDto) {
    this.body = data.body;
    this.receiver = data.receiver;
    this.sender = data.sender;

    this.validate();
  }

  private validate(): void {
    new Validation(this.receiver, 'receiver').isDefined().isString().isObjectId();
    new Validation(this.sender, 'sender').isDefined().isString().isObjectId();
    new Validation(this.body, 'body').isDefined().isString().hasLength(1000, 2);
  }
}
