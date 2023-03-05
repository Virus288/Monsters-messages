import Message from './model';
import type * as types from '../../types';
import { INewMessage } from '../../types';
import { EDbCollections } from '../../enums';
import { IObjectUpdate } from '../../types/generic';
import mongoose from 'mongoose';

export default class Rooster {
  async add(data: INewMessage): Promise<void> {
    const NewMessage = new Message(data);
    await NewMessage.save();
  }

  async get(owner: string, page: number): Promise<types.IMessage[]> {
    return Message.find({ owner: owner })
      .limit(20)
      .skip((page - 1) * 20);
  }

  async getWithDetails(owner: string, page: number): Promise<types.IFullMessageLean[]> {
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

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as types.IFullMessageLean;
    });
  }

  async getOne(_id: string): Promise<types.IMessage[]> {
    return Message.findOne({ _id: _id });
  }

  async getOneWithDetails(_id: string, owner: string): Promise<types.IFullMessageLean[]> {
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

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as types.IFullMessageLean;
    });
  }

  async getUnreadWithDetails(owner: string, page: number): Promise<types.IFullMessageLean[]> {
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

    return data.map((elm) => {
      return { ...elm, details: elm.details[0] } as types.IFullMessageLean;
    });
  }

  async update(_id: string, data: IObjectUpdate<types.IMessageLean, keyof types.IMessageLean>): Promise<void> {
    await Message.updateOne({ _id: _id }, { $set: { ...data } }, { upsert: true });
  }
}
