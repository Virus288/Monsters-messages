import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  ILocalUser,
  IMessageDetailsLean,
  IMessageGet,
  IMessageLean,
  IMessageRead,
  IMessageSend,
} from '../../../src/types';
import Controller from '../../../src/modules/messages/controller';
import Database from '../../utils/mockDB';
import { EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';

describe('Messages', () => {
  const fakeMessage = fakeData.messages[0] as IMessageLean;
  const fakeMessage2 = fakeData.messages[1] as IMessageLean;
  const fakeDetails = fakeData.details[0] as IMessageDetailsLean;
  const fakeDetails2 = fakeData.details[1] as IMessageDetailsLean;
  const localUser: ILocalUser = {
    userId: fakeMessage.owner,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const get: IMessageGet = { page: 1, message: fakeMessage._id };
  const getMany: IMessageGet = { page: 1 };
  const read: IMessageRead = { message: fakeMessage._id, page: 1 };
  const send: IMessageSend = {
    body: fakeDetails.message,
    receiver: fakeMessage.receiver,
    sender: fakeMessage.owner,
  };
  const controller = new Controller();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Get one - missing page`, () => {
        const clone = structuredClone(get);
        delete clone.page;
        controller.get(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'page'));
        });
      });

      it(`Read - missing page`, () => {
        const clone = structuredClone(read);
        delete clone.page;
        controller.read(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'page'));
        });
      });

      it(`Read - missing message`, () => {
        const clone = structuredClone(read);
        delete clone.message;
        controller.read(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'message'));
        });
      });

      it(`Send - missing body`, () => {
        const clone = structuredClone(send);
        delete clone.body;
        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'body'));
        });
      });

      it(`Send - missing receiver`, () => {
        const clone = structuredClone(send);
        delete clone.receiver;
        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'receiver'));
        });
      });

      it(`Send - missing sender`, () => {
        const clone = structuredClone(send);
        delete clone.sender;
        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'sender'));
        });
      });

      it(`Get many - missing page`, () => {
        const clone = structuredClone(getMany);
        delete clone.page;
        controller.get(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'page'));
        });
      });

      it(`Get unread - missing page`, () => {
        const clone = structuredClone(getMany);
        delete clone.page;
        controller.getUnread(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingData('2', 'page'));
        });
      });
    });

    describe('Incorrect data', () => {
      const db = new Database();

      beforeEach(async () => {
        await db.message
          .id(fakeMessage._id)
          .sender(fakeMessage.sender)
          .body(fakeMessage.body)
          .owner(fakeMessage.owner)
          .read(fakeMessage.read)
          .receiver(fakeMessage.receiver)
          .create();

        await db.details.id(fakeDetails._id).message(fakeDetails.message).create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Get one - page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'asd' as unknown as number;

        controller.get(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'page'));
        });
      });

      it(`Read - page incorrect type`, () => {
        const clone = structuredClone(read);
        clone.page = 'asd' as unknown as number;

        controller.read(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'page'));
        });
      });

      it(`Read - message incorrect type`, () => {
        const clone = structuredClone(read);
        clone.message = 'asd';

        controller.read(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'message'));
        });
      });

      it(`Send - body too short`, () => {
        const clone = structuredClone(send);
        clone.body = 'a';

        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(
            new errors.InvalidSize('2', 'Message body should be more than 2 characters and less than 1000 characters'),
          );
        });
      });

      it(`Send - receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'abc';

        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'receiver'));
        });
      });

      it(`Send - sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'abc';

        controller.send(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'sender'));
        });
      });

      it(`Get many - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'a' as unknown as number;

        controller.get(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'page'));
        });
      });

      it(`Get unread - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'abc' as unknown as number;

        controller.getUnread(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.InvalidType('2', 'page'));
        });
      });
    });
  });

  describe('Should pass', () => {
    const db = new Database();

    beforeEach(async () => {
      await db.message
        .id(fakeMessage._id)
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .owner(fakeMessage.owner)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.message
        .id(fakeMessage2._id)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .owner(fakeMessage2.owner)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.details.id(fakeDetails._id).message(fakeDetails.message).create();
      await db.details.id(fakeDetails2._id).message(fakeDetails2.message).create();
    });

    afterEach(async () => {
      await db.cleanUp();
    });

    it(`Get one`, async () => {
      const data = await controller.get(get, localUser);
      const elm = data[0];

      expect(data.length).toEqual(1);
      expect(elm.read).toEqual(fakeMessage.read);
      expect(elm._id.toString()).toEqual(fakeMessage._id);
      expect(elm.body.toString()).toEqual(fakeMessage.body);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.owner.toString()).toEqual(fakeMessage.owner);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.details.message).toEqual(fakeDetails.message);
    });

    it(`Get many`, async () => {
      const data = await controller.get(getMany, localUser);
      const elm = data[0];
      const elm2 = data[1];

      expect(data.length).toEqual(2);
      expect(elm._id.toString()).toEqual(fakeMessage._id);
      expect(elm2._id.toString()).toEqual(fakeMessage2._id);
      expect(elm.details.message).toEqual(fakeDetails.message);
      expect(elm2.details.message).toEqual(fakeDetails2.message);
    });

    it(`Get unread`, async () => {
      const data = await controller.getUnread(getMany, localUser);
      const elm = data[0];

      expect(data.length).toEqual(1);
      expect(elm.read).toEqual(false);
    });

    it(`Read`, async () => {
      const before = await controller.getUnread(getMany, localUser);
      expect(before.length).toEqual(1);

      await controller.read(read, localUser);

      const after = await controller.getUnread(getMany, localUser);
      expect(after.length).toEqual(0);
    });

    it(`Send`, async () => {
      await controller.send(send, localUser);
      const data = await controller.get(getMany, localUser);
      expect(data.length).toEqual(3);
    });
  });
});
