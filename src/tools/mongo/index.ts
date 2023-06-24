import mongoose from 'mongoose';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type { ConnectOptions } from 'mongoose';

export default class Mongo {
  async init(): Promise<void> {
    process.env.NODE_ENV === 'test' ? await this.startMockServer() : await this.startServer();
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }

  private async startMockServer(): Promise<void> {
    console.info('Inside mock');
    const MockServer = await import('./mock');
    const mock = new MockServer.default();
    await mock.init();
  }

  private async startServer(): Promise<void> {
    await mongoose.connect(getConfig().mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Messages',
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }
}
