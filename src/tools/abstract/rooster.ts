import type { EModules } from './enums';
import type { IRoosterAddData, IRoosterFactory, IRoosterGetData, IRoosterGetInData } from './types';
import type { Document, Model } from 'mongoose';

export default abstract class RoosterFactory<T extends Document, U extends Model<T>, Z extends EModules>
  implements IRoosterFactory<Z>
{
  private readonly _model: U;

  constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async add(data: IRoosterAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();
    return callback._id as string;
  }

  async get(_id: unknown): Promise<IRoosterGetData[Z] | null> {
    return this.model.findOne({ _id }).lean();
  }

  async getAll(page: number): Promise<IRoosterGetInData[Z]> {
    return this.model
      .find({})
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async getIn(target: string, value: string[]): Promise<IRoosterGetInData[Z]> {
    const query = {};
    query[target] = {
      $in: value,
    };
    return this.model.find(query).lean();
  }
}
