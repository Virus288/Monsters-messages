import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ILocalUser, IPreparedMessagesBody } from '../../../src/types';
import Controller from '../../../src/modules/chat/controller';
import { EMessageTargets, EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import { IFullMessageEntity, IMessageEntity } from '../../../src/modules/messages/entity';
import { IMessageDetailsEntity } from '../../../src/modules/messagesDetails/entity';
import { IGetMessageDto, IReadMessageDto, ISendMessageDto } from '../../../src/modules/messages/dto';
import FakeFactory from '../../utils/fakeFactory/src';

describe('Chat', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[2] as IMessageEntity;
  const fakeMessage2 = fakeData.messages[1] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const fakeDetails2 = fakeData.details[1] as IMessageDetailsEntity;
  const localUser: ILocalUser = {
    userId: fakeMessage.sender,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const messageReceiver: ILocalUser = {
    userId: fakeMessage.receiver,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const get: IGetMessageDto = { page: 1, target: fakeMessage.chatId };
  const getMany: IGetMessageDto = { page: 1 };
  const read: IReadMessageDto = { chatId: fakeMessage.chatId, user: fakeMessage.receiver };
  const send: ISendMessageDto = {
    body: fakeDetails.message,
    receiver: fakeMessage.receiver,
    sender: fakeMessage.sender,
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
        clone.chatId = undefined!;
        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('chatId'));
        });
      });

      it(`Send - missing body`, () => {
        const clone = structuredClone(send);
        clone.body = undefined!;
        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('body'));
        });
      });

      it(`Send - missing receiver`, () => {
        const clone = structuredClone(send);
        clone.receiver = undefined!;
        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('receiver'));
        });
      });

      it(`Send - missing sender`, () => {
        const clone = structuredClone(send);
        clone.sender = undefined!;
        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
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
        await db.chat
          .sender(fakeMessage.sender)
          .body(fakeMessage.body)
          .chatId(fakeMessage.chatId)
          .type(fakeMessage.type)
          ._id(fakeMessage._id)
          .read(fakeMessage.read)
          .receiver(fakeMessage.receiver)
          .create();
        await db.details.message(fakeDetails.message)._id(fakeDetails._id).create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Get one - page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'asd' as unknown as number;

        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Read - user incorrect type`, () => {
        const clone = structuredClone(read);
        clone.user = 'asd';

        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('user', 24, 24));
        });
      });

      it(`Read - id incorrect type`, () => {
        const clone = structuredClone(read);
        clone.chatId = 'asd';

        controller.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('chatId', 24, 24));
        });
      });

      it(`Send - body too short`, () => {
        const clone = structuredClone(send);
        clone.body = 'a';

        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('body', 2, 1000));
        });
      });

      it(`Send - receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'abc';

        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('receiver', 24, 24));
        });
      });

      it(`Send - sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'abc';

        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('sender', 24, 24));
        });
      });

      it(`Get many - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'a' as unknown as number;

        controller.get(clone, EMessageTargets.Messages).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Get unread - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'abc' as unknown as number;

        controller.getUnread(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Send - cannot send message to yourself`, () => {
        const clone = structuredClone(send);
        clone.sender = localUser.userId;

        controller.send(clone, EMessageTargets.Messages, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.ActionNotAllowed());
        });
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await db.chat
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.chat
        ._id(fakeMessage2._id)
        .chatId(fakeMessage2.chatId)
        .type(fakeMessage2.type)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
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
      const data = (await controller.get(get, localUser.userId)) as IFullMessageEntity[];
      const elm = data[0]!;

      expect(data.length).toEqual(2);
      expect(elm.read).toEqual(fakeMessage.read);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.message).toEqual(fakeDetails.message);
    });

    it(`Get many`, async () => {
      const data = (await controller.get(getMany, localUser.userId)) as Record<string, IPreparedMessagesBody>;
      const target = Object.keys(data)[0]!;
      const elm = data[target]!;

      expect(Object.keys(data).length).toEqual(1);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.messages).toEqual(1);
    });

    it(`Get unread`, async () => {
      const data = await controller.getUnread(getMany, EMessageTargets.Messages, messageReceiver.userId);
      const elm = data[0]!;

      expect(data.length).toEqual(1);
      expect(elm.participants.includes(fakeMessage.sender)).toEqual(true);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.unread).toEqual(1);
    });

    it(`Read`, async () => {
      const before = await controller.getUnread(getMany, EMessageTargets.Messages, messageReceiver.userId);
      expect(before.length).toEqual(1);

      await controller.read(read);

      const after = await controller.getUnread(getMany, EMessageTargets.Messages, messageReceiver.userId);
      expect(after.length).toEqual(0);
    });

    it(`Send`, async () => {
      await controller.send(send, EMessageTargets.Messages, localUser.userId);

      const data = await controller.get(getMany, localUser.userId);
      const key = Object.keys(data)[0]!;

      expect(data[key].messages).toEqual(2);
    });
  });
});
