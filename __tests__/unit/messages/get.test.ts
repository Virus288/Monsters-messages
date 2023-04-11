import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/messages/validation';
import * as errors from '../../../src/errors';
import { IGetMessageDto } from '../../../src/modules/messages/dto';

describe('Message - get', () => {
  const get: IGetMessageDto = { page: 1 };
  const getWithData: IGetMessageDto = { target: '63e55edbe8a800060911121d', page: 1 };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(get);
        clone.page = undefined!;
        const func = () => Validation.validateGetMessage(clone);

        expect(func).toThrow(new errors.MissingArgError('page'));
      });
    });

    describe('Incorrect data', () => {
      it(`Page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'bc' as unknown as number;
        const func = () => Validation.validateGetMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('page should be number'));
      });

      it(`Target incorrect type`, () => {
        const clone = structuredClone(getWithData);
        clone.target = 'bc';
        const func = () => Validation.validateGetMessage(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Elm target should be 24 characters'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Get multi`, () => {
      const clone = structuredClone(get);
      const func = () => Validation.validateGetMessage(clone);

      expect(func).not.toThrow();
    });
    it(`Get 1`, () => {
      const clone = structuredClone(getWithData);
      const func = () => Validation.validateGetMessage(clone);

      expect(func).not.toThrow();
    });
  });
});
