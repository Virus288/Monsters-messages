import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ILocalUser } from '../../../src/types';
import Controller from '../../../src/modules/messages/controller';
import { EMessageTargets, EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import { IMessageEntity } from '../../../src/modules/messages/entity';
import { IMessageDetailsEntity } from '../../../src/modules/messagesDetails/entity';
import { IGetMessageDto, IReadMessageDto, ISendMessageDto } from '../../../src/modules/messages/dto';
import FakeFactory from '../../utils/fakeFactory/src';

describe('Messages', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const fakeMessage2 = fakeData.messages[1] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const fakeDetails2 = fakeData.details[1] as IMessageDetailsEntity;
  const localUser: ILocalUser = {
    userId: fakeMessage.owner,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const get: IGetMessageDto = { page: 1, target: fakeMessage.chatId };
  const getMany: IGetMessageDto = { page: 1 };
  const read: IReadMessageDto = { id: fakeMessage.chatId, user: fakeMessage.sender };
  const send: ISendMessageDto = {
    body: fakeDetails.message,
    receiver: fakeMessage.receiver,
    sender: fakeMessage.owner,
  };
  const controller = new Controller();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Get one - missing page`, () => {
        const clone = structuredClone(get);
        clone.page = undefined!;
        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });

      it(`Read - missing user`, () => {
        const clone = structuredClone(read);
        clone.user = undefined!;
        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('user'));
        });
      });

      it(`Read - missing id`, () => {
        const clone = structuredClone(read);
        clone.id = undefined!;
        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });

      it(`Send - missing body`, () => {
        const clone = structuredClone(send);
        clone.body = undefined!;
        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('body'));
        });
      });

      it(`Send - missing receiver`, () => {
        const clone = structuredClone(send);
        clone.receiver = undefined!;
        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('receiver'));
        });
      });

      it(`Send - missing sender`, () => {
        const clone = structuredClone(send);
        clone.sender = undefined!;
        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('sender'));
        });
      });

      it(`Get many - missing page`, () => {
        const clone = structuredClone(getMany);
        clone.page = undefined!;
        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });

      it(`Get unread - missing page`, () => {
        const clone = structuredClone(getMany);
        clone.page = undefined!;
        controller.getUnread(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await db.message
          ._id(fakeMessage._id)
          .sender(fakeMessage.sender)
          .body(fakeMessage.body)
          .owner(fakeMessage.owner)
          .read(fakeMessage.read)
          .receiver(fakeMessage.receiver)
          .create();

        await db.details._id(fakeDetails._id).message(fakeDetails.message).create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Get one - page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'asd' as unknown as number;

        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Page should be number'));
        });
      });

      it(`Read - user incorrect type`, () => {
        const clone = structuredClone(read);
        clone.user = 'asd';

        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('User should be number'));
        });
      });

      it(`Read - id incorrect type`, () => {
        const clone = structuredClone(read);
        clone.id = 'asd';

        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Id should be 24 characters string'));
        });
      });

      it(`Send - body too short`, () => {
        const clone = structuredClone(send);
        clone.body = 'a';

        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('Message', 2, 1000));
        });
      });

      it(`Send - receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'abc';

        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Receiver should be 24 characters string'));
        });
      });

      it(`Send - sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'abc';

        controller.send(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Sender should be 24 characters string'));
        });
      });

      it(`Get many - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'a' as unknown as number;

        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Page should be number'));
        });
      });

      it(`Get unread - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'abc' as unknown as number;

        controller.getUnread(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Page should be number'));
        });
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await db.message
        ._id(fakeMessage._id)
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .owner(fakeMessage.owner)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.message
        ._id(fakeMessage2._id)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .owner(fakeMessage2.owner)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.details._id(fakeDetails._id).message(fakeDetails.message).create();
      await db.details._id(fakeDetails2._id).message(fakeDetails2.message).create();
    });

    afterEach(async () => {
      await db.cleanUp();
    });

    it(`Get one`, async () => {
      const data = await controller.get(get, EMessageTargets.Messages);
      const elm = data[0]!;

      expect(data.length).toEqual(1);
      expect(elm.read).toEqual(fakeMessage.read);
      expect(elm._id.toString()).toEqual(fakeMessage._id);
      expect(elm.body.toString()).toEqual(fakeMessage.body);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.owner.toString()).toEqual(fakeMessage.owner);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
    });

    it(`Get many`, async () => {
      const data = (await controller.get(getMany, EMessageTargets.Messages)) as IMessageEntity[];
      const elm = data[0]!;
      const elm2 = data[1]!;

      expect(data.length).toEqual(2);
      expect(elm._id.toString()).toEqual(fakeMessage._id);
      expect(elm2._id.toString()).toEqual(fakeMessage2._id);
    });

    it(`Get unread`, async () => {
      const data = await controller.getUnread(getMany, EMessageTargets.Messages, localUser.userId);
      const elm = data[0]!;

      expect(data.length).toEqual(1);
      expect(elm.read).toEqual(false);
    });

    it(`Read`, async () => {
      const before = await controller.getUnread(getMany, EMessageTargets.Messages, localUser.userId);
      expect(before.length).toEqual(1);

      await controller.read(read);

      const after = await controller.getUnread(getMany, EMessageTargets.Messages, localUser.userId);
      expect(after.length).toEqual(0);
    });

    it(`Send`, async () => {
      await controller.send(send, EMessageTargets.Messages);
      const data = await controller.get(getMany, EMessageTargets.Messages);
      expect(data.length).toEqual(3);
    });
  });
});
