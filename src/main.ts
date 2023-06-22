import Broker from './broker';
import Log from './tools/logger/log';
import Mongo from './tools/mongo';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  init(): void {
    this.start().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      return this.kill();
    });
  }

  kill(): void {
    State.broker.close();

    Log.log('Server', 'Server closed');
  }

  private async start(): Promise<void> {
    const mongo = new Mongo();
    await mongo.init();

    State.broker = new Broker();

    State.broker.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
