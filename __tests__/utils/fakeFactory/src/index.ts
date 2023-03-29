import FakeDetails from './details';
import FakeMessage from './message';

export default class FakeFactory {
  private readonly _message: FakeMessage;
  private readonly _messageDetails: FakeDetails;

  constructor() {
    this._message = new FakeMessage();
    this._messageDetails = new FakeDetails();
  }

  get message(): FakeMessage {
    return this._message;
  }

  get details(): FakeDetails {
    return this._messageDetails;
  }

  async cleanUp(): Promise<void> {
    await this._message.cleanUp();
    await this._messageDetails.cleanUp();
  }
}
