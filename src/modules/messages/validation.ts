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

    if (typeof page !== 'number') throw new errors.IncorrectArgTypeError('Page should be number');
    if (page <= 0 || page > 1000) throw new errors.IncorrectArgLengthError('page', 0, 1000);

    if (data.message !== undefined) {
      if (data.message.length !== 24) throw new errors.IncorrectArgTypeError('Message should be 24 characters string');
      const isValid = mongoose.Types.ObjectId.isValid(data.message);
      if (!isValid) throw new errors.IncorrectArgTypeError('Message is not valid id');
    }
  }

  static validateReadMessage(data: IReadMessageDto): void {
    if (data.message === undefined) throw new errors.MissingArgError('message');
    this.validateGetMessage(data);
  }

  static validateDetails(messageBody: string): void {
    if (!messageBody) throw new errors.MissingArgError('body');
    if (messageBody.length < 2 || messageBody.length > 1000)
      throw new errors.IncorrectArgLengthError('Message', 2, 1000);
  }

  static validateMessage(data: ISendMessageDto): void {
    if (!data.sender) throw new errors.MissingArgError('sender');
    if (!data.receiver) throw new errors.MissingArgError('receiver');
    const { receiver, sender } = data;

    if (receiver.length !== 24) throw new errors.IncorrectArgTypeError('Receiver should be 24 characters string');
    const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);
    if (!isValidReceiver) throw new errors.IncorrectArgError('Receiver is not valid id');

    if (sender.length !== 24) throw new errors.IncorrectArgTypeError('Sender should be 24 characters string');
    const isValidSender = mongoose.Types.ObjectId.isValid(sender);
    if (!isValidSender) throw new errors.IncorrectArgError('Sender is not valid id');
  }
}
