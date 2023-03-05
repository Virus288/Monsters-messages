import FakeMessage from './message';
import FakeDetails from './details';

export default class Database {
  message: FakeMessage;
  details: FakeDetails;

  constructor() {
    this.message = new FakeMessage();
    this.details = new FakeDetails();
  }

  async cleanUp(): Promise<void> {
    await this.message.cleanUp();
    await this.details.cleanUp();
  }
}
