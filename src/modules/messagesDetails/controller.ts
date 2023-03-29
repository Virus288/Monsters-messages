import type mongoose from 'mongoose';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import Rooster from './rooster';

export default class MessageDetails extends ControllerFactory<EModules.MessageDetails> {
  constructor() {
    super(new Rooster());
  }

  async add(body: string): Promise<mongoose.Types.ObjectId> {
    return this.rooster.add(body);
  }
}
