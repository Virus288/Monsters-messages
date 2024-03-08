import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import MessageDetailsModel from '../messagesDetails/model';
import type { EModules } from '../../tools/abstract/enums';

export default class MessageDetails extends ControllerFactory<EModules.MessageDetails> {
  constructor() {
    super(new Rooster(MessageDetailsModel));
  }

  async add(body: string): Promise<string> {
    return this.rooster.add({ message: body });
  }
}
