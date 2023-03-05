import { describe, expect, it } from '@jest/globals';
import { IMessageRead } from '../../../src/types';
import Validation from '../../../src/validation';
import * as errors from '../../../src/errors';

describe('Message - read', () => {
  const read: IMessageRead = { message: '63e55edbe8a800060911121d', page: 1 };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(read);
        delete clone.page;
        const func = () => Validation.validateReadMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'page'));
      });

      it(`Missing message`, () => {
        const clone = structuredClone(read);
        delete clone.message;
        const func = () => Validation.validateReadMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'message'));
      });
    });

    describe('Incorrect data', () => {
      it(`Page incorrect type`, () => {
        const clone = structuredClone(read);
        clone.page = 'bc' as unknown as number;
        const func = () => Validation.validateReadMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'page'));
      });

      it(`Message incorrect type`, () => {
        const clone = structuredClone(read);
        clone.message = 'bc';
        const func = () => Validation.validateReadMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'message'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Read`, () => {
      const clone = structuredClone(read);
      const func = () => Validation.validateReadMessage('2', clone);

      expect(func).not.toThrow();
    });
  });
});
