import Message from './model';
import type * as types from '../../types';
import type { EMessageTargets } from '../../enums';
import { EDbCollections } from '../../enums';
import mongoose from 'mongoose';
import type { IFullMessageEntity, IMessageEntity } from './entity';

export default class Rooster {
  async add(data: types.INewMessage): Promise<void> {
    const NewMessage = new Message(data);
    await NewMessage.save();
  }

  async get(owner: string, page: number): Promise<IMessageEntity[]> {
    return Message.find({ $or: [{ sender: owner }, { receiver: owner }] })
      .limit(20)
      .skip((page - 1) * 20)
      .lean();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullMessageEntity[]> {
    const data = (await Message.aggregate([
      {
        $match: { chatId: new mongoose.Types.ObjectId(chatId) },
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

  async getOne(sender: string, receiver: string): Promise<IMessageEntity | null> {
    return Message.findOne({
      $or: [
        { sender, receiver },
        { receiver: sender, sender: receiver },
      ],
    }).lean();
  }

  async getOneByChatId(chatId: string, sender: string): Promise<IMessageEntity | null> {
    return Message.findOne({ chatId, sender }).lean();
  }

  async getUnread(owner: string, type: EMessageTargets, page: number): Promise<IMessageEntity[]> {
    return Message.find({ $or: [{ sender: owner }, { receiver: owner }], read: false, type })
      .limit(20)
      .skip((page - 1) * 20)
      .lean();
  }

  async update(
    { chatId, sender }: IMessageEntity,
    data: types.IObjectUpdate<IMessageEntity, keyof IMessageEntity>,
  ): Promise<void> {
    await Message.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
