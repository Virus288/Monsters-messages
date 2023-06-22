import mongoose from 'mongoose';
import Mock from './mock';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type { ConnectOptions } from 'mongoose';

export default class Mongo {
  mock: Mock;

  constructor() {
    this.mock = new Mock();
  }

  async init(): Promise<void> {
    process.env.NODE_ENV === 'test' ? await this.startMockServer() : await this.startServer();
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }

  private async startMockServer(): Promise<void> {
    await this.mock.init();
  }

  private async startServer(): Promise<void> {
    await mongoose.connect(getConfig().mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Users',
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }
}
