import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/messages/validation';
import * as errors from '../../../src/errors';
import { IReadMessageDto } from '../../../src/modules/messages/dto';

describe('Message - read', () => {
  const read: IReadMessageDto = { id: '63e55edbe8a800060911121d', user: '63e55edbe8a800060911121d' };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, () => {
        const clone = structuredClone(read);
        clone.id = undefined!;
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('id'));
      });

      it(`Missing user`, () => {
        const clone = structuredClone(read);
        clone.user = undefined!;
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('user'));
      });
    });

    describe('Incorrect data', () => {
      it(`Id incorrect type`, () => {
        const clone = structuredClone(read);
        clone.id = 'id';
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Elm id should be 24 characters'));
      });

      it(`User incorrect type`, () => {
        const clone = structuredClone(read);
        clone.user = 'bc';
        const func = () => Validation.validateReadMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Elm user should be 24 characters'));
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
