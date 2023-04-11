import * as errors from '../../errors';
import mongoose from 'mongoose';
import type { IGetMessageDto, IReadMessageDto, ISendMessageDto } from './dto';

export default class Validator {
  static validateNewMessage(data: ISendMessageDto): void {
    this.validateDetails(data?.body);
    this.validateMessage(data);
  }

  static validateGetMessage(data: IGetMessageDto): void {
    if (data.page === undefined) throw new errors.MissingArgError('page');
    const { page } = data;

    if (typeof page !== 'number') throw new errors.IncorrectArgTypeError('page should be number');
    if (page <= 0 || page > 1000) throw new errors.IncorrectArgLengthError('page', 0, 1000);

    if (data.target !== undefined) {
      if (data.target.length !== 24) throw new errors.IncorrectArgLengthError('target', 24, 24);
      const isValid = mongoose.Types.ObjectId.isValid(data.target);
      if (!isValid) throw new errors.IncorrectArgTypeError('target is not valid id');
    }
  }

  static validateReadMessage(data: IReadMessageDto): void {
    if (data.chatId === undefined) throw new errors.MissingArgError('chatId');
    if (data.user === undefined) throw new errors.MissingArgError('user');

    if (data.user.length !== 24) throw new errors.IncorrectArgLengthError('user', 24, 24);
    if (data.chatId.length !== 24) throw new errors.IncorrectArgLengthError('chatId', 24, 24);
  }

  static validateDetails(messageBody: string): void {
    if (!messageBody) throw new errors.MissingArgError('body');
    if (messageBody.length < 2 || messageBody.length > 1000) throw new errors.IncorrectArgLengthError('body', 2, 1000);
  }

  static validateMessage(data: ISendMessageDto): void {
    if (!data.sender) throw new errors.MissingArgError('sender');
    if (!data.receiver) throw new errors.MissingArgError('receiver');
    const { receiver, sender } = data;

    if (receiver.length !== 24) throw new errors.IncorrectArgLengthError('receiver', 24, 24);
    const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);
    if (!isValidReceiver) throw new errors.IncorrectArgError('receiver is not valid id');

    if (sender.length !== 24) throw new errors.IncorrectArgLengthError('sender', 24, 24);
    const isValidSender = mongoose.Types.ObjectId.isValid(sender);
    if (!isValidSender) throw new errors.IncorrectArgError('sender is not valid id');
  }
}
