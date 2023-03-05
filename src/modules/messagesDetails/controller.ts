import mongoose from 'mongoose';
import Rooster from './rooster';

export default class MessageDetails {
  private readonly _rooster: Rooster;

  constructor() {
    this._rooster = new Rooster();
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  async add(body: string): Promise<mongoose.Types.ObjectId> {
    return this.rooster.add(body);
  }
}
