import { describe, expect, it } from '@jest/globals';
import { IMessageGet } from '../../../src/types';
import Validation from '../../../src/validation';
import * as errors from '../../../src/errors';

describe('Message - get', () => {
  const get: IMessageGet = { page: 1 };
  const getWithData: IMessageGet = { message: '63e55edbe8a800060911121d', page: 1 };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(get);
        delete clone.page;
        const func = () => Validation.validateGetMessage('2', clone);

        expect(func).toThrow(new errors.MissingData('2', 'page'));
      });
    });

    describe('Incorrect data', () => {
      it(`Page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'bc' as unknown as number;
        const func = () => Validation.validateGetMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'page'));
      });

      it(`Message incorrect type`, () => {
        const clone = structuredClone(getWithData);
        clone.message = 'bc';
        const func = () => Validation.validateGetMessage('2', clone);

        expect(func).toThrow(new errors.InvalidType('2', 'message'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Get multi`, () => {
      const clone = structuredClone(get);
      const func = () => Validation.validateGetMessage('2', clone);

      expect(func).not.toThrow();
    });
    it(`Get 1`, () => {
      const clone = structuredClone(getWithData);
      const func = () => Validation.validateGetMessage('2', clone);

      expect(func).not.toThrow();
    });
  });
});
