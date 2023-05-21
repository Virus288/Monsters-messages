import type { EModules } from './enums';
import type { IRoosterAddData, IRoosterFactory, IRoosterGetData } from './types';
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

  async add(data: IRoosterAddData[Z]): Promise<void> {
    const newElement = new this.model(data);
    await newElement.save();
  }

  async get(_data: unknown): Promise<IRoosterGetData[Z]> {
    return this.model.find({}).lean();
  }
}
