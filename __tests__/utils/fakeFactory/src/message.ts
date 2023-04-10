import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import Message from '../../../../src/modules/messages/model';
import type { IAbstractBody } from '../types/data';
import { IMessageEntity } from '../../../../src/modules/messages/entity';
import { EMessageTargets } from '../../../../src/enums';

export default class FakeMessage extends TemplateFactory<EFakeData.Message> implements IAbstractBody<IMessageEntity> {
  constructor() {
    super(Message);
  }

  _id(id: string): this {
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

  type(type: EMessageTargets): this {
    this.state.type = type;
    return this;
  }

  chatId(id?: string): this {
    this.state.chatId = id;
    return this;
  }

  protected fillState(): void {
    this.state = {
      _id: undefined,
      body: undefined,
      owner: undefined,
      read: false,
      sender: undefined,
      receiver: undefined,
      type: EMessageTargets.Messages,
      chatId: undefined,
    };
  }
}
