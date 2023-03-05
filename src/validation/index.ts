import type * as types from '../types';
import * as errors from '../errors';
import mongoose from 'mongoose';

export default class Validator {
  static validateNewMessage(tempId: string, data: types.IMessageSend): void {
    this.validateDetails(tempId, data?.body);
    this.validateMessage(tempId, data);
  }

  static validateGetMessage(tempId: string, data: types.IMessageGet): void {
    if (data.page === undefined) throw new errors.MissingData(tempId, 'page');
    const { page } = data;

    if (typeof page !== 'number') throw new errors.InvalidType(tempId, 'page');
    if (page <= 0) throw new errors.InvalidType(tempId, 'page should be bigger than 0');

    if (data.message !== undefined) {
      const isValid = mongoose.Types.ObjectId.isValid(data.message);
      if (!isValid) throw new errors.InvalidType(tempId, 'message');
    }
  }

  static validateReadMessage(tempId: string, data: types.IMessageRead): void {
    if (data.message === undefined) throw new errors.MissingData(tempId, 'message');
    this.validateGetMessage(tempId, data);
  }

  static validateDetails(tempId: string, messageBody: string): void {
    if (!messageBody) throw new errors.MissingData(tempId, 'body');
    if (messageBody.length < 2 || messageBody.length > 1000)
      throw new errors.InvalidSize(
        tempId,
        'Message body should be more than 2 characters and less than 1000 characters',
      );
  }

  static validateMessage(tempId: string, data: types.IMessageSend): void {
    if (!data.sender) throw new errors.MissingData(tempId, 'sender');
    if (!data.receiver) throw new errors.MissingData(tempId, 'receiver');
    const { receiver, sender } = data;

    const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);
    if (!isValidReceiver) throw new errors.InvalidType(tempId, 'receiver');

    const isValidSender = mongoose.Types.ObjectId.isValid(sender);
    if (!isValidSender) throw new errors.InvalidType(tempId, 'sender');
  }
}
