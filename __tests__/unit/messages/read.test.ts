import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/messages/validation';
import * as errors from '../../../src/errors';
import { IReadMessageDto } from '../../../src/modules/messages/dto';

describe('Message - read', () => {
  const read: IReadMessageDto = { message: '63e55edbe8a800060911121d', page: 1 };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(read);
        clone.page = undefined!;
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('page'));
      });

      it(`Missing message`, () => {
        const clone = structuredClone(read);
        clone.message = undefined!;
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('message'));
      });
    });

    describe('Incorrect data', () => {
      it(`Page incorrect type`, () => {
        const clone = structuredClone(read);
        clone.page = 'bc' as unknown as number;
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Page should be number'));
      });

      it(`Message incorrect type`, () => {
        const clone = structuredClone(read);
        clone.message = 'bc';
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Message should be 24 characters string'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Read`, () => {
      const clone = structuredClone(read);
      const func = () => Validation.validateReadMessage(clone);

      expect(func).not.toThrow();
    });
  });
});
