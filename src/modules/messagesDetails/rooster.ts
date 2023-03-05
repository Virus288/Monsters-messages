import Details from './model';
import type * as types from '../../types';
import mongoose from 'mongoose';

export default class Rooster {
  async add(message: string): Promise<mongoose.Types.ObjectId> {
    const NewDetails = new Details({ message });
    const document = await NewDetails.save();
    return document._id;
  }

  async get(ids: string[]): Promise<types.IMessageDetailsLean> {
    return Details.find({
      _id: {
        $in: ids,
      },
    }).lean();
  }
}
