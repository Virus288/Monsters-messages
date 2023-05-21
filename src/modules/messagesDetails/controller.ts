import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import type mongoose from 'mongoose';

export default class MessageDetails extends ControllerFactory<EModules.MessageDetails> {
  constructor() {
    super(new Rooster());
  }

  async add(body: string): Promise<mongoose.Types.ObjectId> {
    return this.rooster.add(body);
  }
}
