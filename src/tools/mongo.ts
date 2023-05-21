import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import getConfig from './configLoader';
import Log from './logger/log';
import fakeData from '../../__tests__/utils/fakeData.json';
import Database from '../../__tests__/utils/fakeFactory/src';
import type { IMessageEntity } from '../modules/messages/entity';
import type { IMessageDetailsEntity } from '../modules/messagesDetails/entity';
import type { ConnectOptions } from 'mongoose';

const fulfillDatabase = async (): Promise<void> => {
  const messages = fakeData.messages as IMessageEntity[];
  const details = fakeData.details as IMessageDetailsEntity[];

  await Promise.all(
    messages.map(async (m) => {
      const db = new Database();
      await db.chat
        .sender(m.sender)
        .body(m.body)
        .chatId(m.chatId)
        .type(m.type)
        ._id(m._id)
        .read(m.read)
        .receiver(m.receiver)
        .create();
    }),
  );

  await Promise.all(
    details.map(async (d) => {
      const db = new Database();
      await db.details._id(d._id).message(d.message).create();
    }),
  );
};

const startServer = async (): Promise<void> => {
  await mongoose.connect(getConfig().mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Messages',
  } as ConnectOptions);
  Log.log('Mongo', 'Started server');
};

const startMockServer = async (): Promise<void> => {
  const server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());

  await fulfillDatabase();
  Log.log('Mongo', 'Started mock server');
};

const mongo = async (): Promise<void> => {
  process.env.NODE_ENV === 'test' ? await startMockServer() : await startServer();
};

export const disconnectMongo = (): void => {
  mongoose.disconnect().catch((err) => {
    Log.error('Mongoose', 'Cannot disconnect', err);
  });
};

export default mongo;
