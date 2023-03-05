import { describe, expect, it } from '@jest/globals';
import { IMessageSend } from '../../../src/types';
import Validation from '../../../src/validation';
import * as errors from '../../../src/errors';

describe('Message - send', () => {
  const send: IMessageSend = {
    body: 'asd',
    receiver: '63e55edbe8a800060931121e',
    sender: '63e55edbe8a800060931121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing body`, () => {
        const clone = structuredClone(send);
        delete clone.body;
        const func = () => Validation.validateNewMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'body'));
      });

      it(`Missing receiver`, () => {
        const clone = structuredClone(send);
        delete clone.receiver;
        const func = () => Validation.validateNewMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'receiver'));
      });

      it(`Missing sender`, () => {
        const clone = structuredClone(send);
        delete clone.sender;
        const func = () => Validation.validateNewMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'sender'));
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'asd';
        const func = () => Validation.validateNewMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'receiver'));
      });

      it(`Sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'asd';
        const func = () => Validation.validateNewMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'sender'));
      });
    });
  });

  describe('Should pass', () => {
    it(`send`, () => {
      const clone = structuredClone(send);
      const func = () => Validation.validateNewMessage('2', clone);

      expect(func).not.toThrow();
    });
  });
});
