import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/messages/validation';
import * as errors from '../../../src/errors';
import { ISendMessageDto } from '../../../src/modules/messages/dto';

describe('Message - send', () => {
  const send: ISendMessageDto = {
    body: 'asd',
    receiver: '63e55edbe8a800060931121e',
    sender: '63e55edbe8a800060931121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing body`, () => {
        const clone = structuredClone(send);
        clone.body = undefined!;
        const func = () => Validation.validateNewMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('body'));
      });

      it(`Missing receiver`, () => {
        const clone = structuredClone(send);
        clone.receiver = undefined!;
        const func = () => Validation.validateNewMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('receiver'));
      });

      it(`Missing sender`, () => {
        const clone = structuredClone(send);
        clone.sender = undefined!;
        const func = () => Validation.validateNewMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('sender'));
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'asd';
        const func = () => Validation.validateNewMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('receiver', 24, 24));
      });

      it(`Sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'asd';
        const func = () => Validation.validateNewMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('sender', 24, 24));
      });
    });
  });

  describe('Should pass', () => {
    it(`send`, () => {
      const clone = structuredClone(send);
      const func = () => Validation.validateNewMessage(clone);

      expect(func).not.toThrow();
    });
  });
});
