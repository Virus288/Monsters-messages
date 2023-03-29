import Message from './model';
import type * as types from '../../types';
import { EDbCollections } from '../../enums';
import mongoose from 'mongoose';
import type { IFullMessageEntity, IMessageEntity } from './entity';

export default class Rooster {
  async add(data: types.INewMessage): Promise<void> {
    const NewMessage = new Message(data);
    await NewMessage.save();
  }

  async get(owner: string, page: number): Promise<types.IMessage[]> {
    return Message.find({ owner })
      .limit(20)
      .skip((page - 1) * 20);
  }

  async getWithDetails(owner: string, page: number): Promise<IFullMessageEntity[]> {
    const data = (await Message.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(owner) },
      },
      {
        $lookup: {
          from: EDbCollections.MessageDetails,
          localField: 'body',
          foreignField: '_id',
          as: 'details',
        },
      },
    ])
      .limit(20)
      .skip((page - 1) * 20)) as types.IFullMessageRaw[];

    if (!data || data.length === 0) return [];

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as IFullMessageEntity;
    });
  }

  async getOne(_id: string): Promise<IMessageEntity | null> {
    return Message.findOne({ _id }).lean();
  }

  async getOneWithDetails(_id: string, owner: string): Promise<IFullMessageEntity[]> {
    const data: types.IFullMessageRaw[] = await Message.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(owner), _id: new mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: EDbCollections.MessageDetails,
          localField: 'body',
          foreignField: '_id',
          as: 'details',
        },
      },
    ]);

    if (!data || data.length === 0) return [];

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as IFullMessageEntity;
    });
  }

  async getUnreadWithDetails(owner: string, page: number): Promise<IFullMessageEntity[]> {
    const data = (await Message.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(owner), read: false },
      },
      {
        $lookup: {
          from: EDbCollections.MessageDetails,
          localField: 'body',
          foreignField: '_id',
          as: 'details',
        },
      },
    ])
      .limit(20)
      .skip((page - 1) * 20)) as types.IFullMessageRaw[];

    if (!data || data.length === 0) return [];

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as IFullMessageEntity;
    });
  }

  async update(_id: string, data: types.IObjectUpdate<IMessageEntity, keyof IMessageEntity>): Promise<void> {
    await Message.updateOne({ _id }, { $set: { ...data } }, { upsert: true });
  }
}
