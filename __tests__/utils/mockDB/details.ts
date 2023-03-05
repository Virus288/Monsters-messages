import { IMessageDetailsLean } from '../../../src/types';
import Details from '../../../src/modules/messagesDetails/model';

export default class FakeDetails {
  private state: IMessageDetailsLean = {
    _id: undefined,
    message: undefined,
  };
  private states: IMessageDetailsLean[] = [];

  id(id: string): this {
    this.state._id = id;
    return this;
  }

  message(message: string): this {
    this.state.message = message;
    return this;
  }

  async create(): Promise<void> {
    const NewDetails = new Details(this.state);
    await NewDetails.save();
    this.states.push(this.state);
    this.clean();
  }

  async cleanUp(): Promise<void> {
    for (let state of this.states) {
      await Details.findOneAndDelete({ _id: state._id });
    }
    this.states = [];
  }

  private clean(): void {
    this.state = {
      _id: undefined,
      message: undefined,
    };
  }
}
