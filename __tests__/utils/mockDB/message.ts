import { IMessageLean } from '../../../src/types';
import Message from '../../../src/modules/messages/model';

export default class FakeMessage {
  private states: IMessageLean[] = [];
  private state: IMessageLean = {
    _id: undefined,
    body: undefined,
    receiver: undefined,
    sender: undefined,
    owner: undefined,
    read: false,
  };

  id(id: string): this {
    this.state._id = id;
    return this;
  }

  body(body: string): this {
    this.state.body = body;
    return this;
  }

  receiver(receiver: string): this {
    this.state.receiver = receiver;
    return this;
  }

  sender(sender: string): this {
    this.state.sender = sender;
    return this;
  }

  owner(owner: string): this {
    this.state.owner = owner;
    return this;
  }

  read(read: boolean): this {
    this.state.read = read;
    return this;
  }

  async create(): Promise<void> {
    const NewMessage = new Message(this.state);
    await NewMessage.save();
    this.states.push(this.state);
    this.clean();
  }

  async cleanUp(): Promise<void> {
    for (let state of this.states) {
      await Message.findOneAndDelete({ _id: state._id });
    }
    this.states = [];
  }

  private clean(): void {
    this.state = {
      _id: undefined,
      body: undefined,
      receiver: undefined,
      sender: undefined,
      owner: undefined,
      read: false,
    };
  }
}
