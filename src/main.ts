import Broker from './broker';
import Log from './tools/logger/log';
import errLogger from './tools/logger/logger';
import mongo, { disconnectMongo } from './tools/mongo';
import State from './tools/state';

class App {
  init(): void {
    const broker = new Broker();

    mongo()
      .then(() => {
        State.Broker = broker;
        return broker.init();
      })
      .catch((err) => {
        Log.log('Server', 'Err while initializing app', JSON.stringify(err));
        errLogger.error(err);
        errLogger.error(JSON.stringify(err));

        disconnectMongo();
        broker.close();
      });
  }
}

const app = new App();
app.init();
