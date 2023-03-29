import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../../src/modules/messages/rooster';
import fakeData from '../../utils/fakeData.json';
import { IMessageEntity } from '../../../src/modules/messages/entity';
import { IMessageDetailsEntity } from '../../../src/modules/messagesDetails/entity';
import FakeFactory from '../../utils/fakeFactory/src';

describe('Messages', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const fakeMessage2 = fakeData.messages[1] as IMessageEntity;
  const rooster = new Rooster();

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

  describe('Should throw', () => {});

  describe('Should pass', () => {
    it(`Add message`, async () => {
      await rooster.add(fakeMessage);
      const message = await rooster.getWithDetails(fakeMessage.owner, 1);

      expect(message.length).toEqual(1);
    });

    it(`Get message`, async () => {
      await db.message
        ._id(fakeMessage2._id)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .owner(fakeMessage2.owner)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.details._id(fakeDetails._id).message(fakeDetails.message).create();

      const message = await rooster.getWithDetails(fakeMessage2.owner, 1);

      expect(message.length).toEqual(2);
      await db.cleanUp();
    });
  });
});
