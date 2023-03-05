import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../../src/modules/messages/rooster';
import fakeData from '../../utils/fakeData.json';
import { IMessageDetailsLean, IMessageLean } from '../../../src/types';
import Database from '../../utils/mockDB';

describe('Messages', () => {
  const fakeMessage = fakeData.messages[0] as IMessageLean;
  const fakeDetails = fakeData.details[0] as IMessageDetailsLean;
  const fakeMessage2 = fakeData.messages[1] as IMessageLean;
  const rooster = new Rooster();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
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
      const db = new Database();
      await db.message
        .id(fakeMessage2._id)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .owner(fakeMessage2.owner)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.details.id(fakeDetails._id).message(fakeDetails.message).create();

      const message = await rooster.getWithDetails(fakeMessage2.owner, 1);

      expect(message.length).toEqual(2);
      await db.cleanUp();
    });
  });
});
