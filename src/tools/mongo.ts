import mongoose, { ConnectOptions } from 'mongoose';
import getConfig from './configLoader';
import Log from './logger/log';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fakeData from '../../__tests__/utils/fakeData.json';
import Database from '../../__tests__/utils/mockDB';
import * as types from '../types';

const mongo = async (): Promise<void> => {
  process.env.NODE_ENV === 'test' ? await startMockServer() : await startServer();
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

const startServer = async (): Promise<void> => {
  await mongoose.connect(getConfig().mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  Log.log('Mongo', 'Started server');
};

const startMockServer = async (): Promise<void> => {
  const server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());

  await fulfillDatabase();
  Log.log('Mongo', 'Started mock server');
};

const fulfillDatabase = async (): Promise<void> => {
  const messages = fakeData.messages as types.IMessageLean[];
  const details = fakeData.details as types.IMessageDetailsLean[];

  await Promise.all(
    messages.map(async (m) => {
      const db = new Database();
      return await db.message
        .id(m._id)
        .sender(m.sender)
        .body(m.body)
        .owner(m.owner)
        .read(m.read)
        .receiver(m.receiver)
        .create();
    }),
  );

  await Promise.all(
    details.map(async (d) => {
      const db = new Database();
      return await db.details.id(d._id).message(d.message).create();
    }),
  );
};

export default mongo;
