import mongoose from 'mongoose';
import { EDbCollections, EMessageTargets } from '../../enums';
import RoosterFactory from '../../tools/abstract/rooster';
import type {
  IChatMessage,
  IChatMessageEntity,
  IFullChatMessageEntity,
  IGetChatMessageEntity,
  IGetOneChatMessageEntity,
  IUnreadChatMessageEntity,
} from './entity';
import type Chat from './model';
import type { EModules } from '../../tools/abstract/enums';
import type * as types from '../../types';

export default class Rooster extends RoosterFactory<IChatMessage, typeof Chat, EModules.Chat> {
  async getByOwner(owner: string, page: number): Promise<IGetChatMessageEntity[]> {
    return this.model
      .find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        _id: false,
        sender: true,
        receiver: true,
        type: true,
        chatId: true,
      })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .sort({ _id: -1 })
      .lean();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullChatMessageEntity[]> {
    const data = (await this.model
      .aggregate([
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
        {
          $project: {
            _id: 0,
            chatId: 1,
            sender: 1,
            receiver: 1,
            read: 1,
            message: { $arrayElemAt: ['$details.message', 0] },
          },
        },
      ])
      .limit(100)
      .sort({ _id: -1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)) as IFullChatMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  /**
   * Get one message with selected sender and receiver. Currently used to validate if user ever had conversation
   */
  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return this.model
      .findOne({
        $or: [
          { sender, receiver },
          { receiver: sender, sender: receiver },
        ],
      })
      .select({ chatId: true })
      .lean();
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneChatMessageEntity | null> {
    return this.model
      .findOne({ chatId, receiver })
      .select({
        read: true,
        chatId: true,
        sender: true,
      })
      .lean();
  }

  async getUnread(owner: string, page: number): Promise<IUnreadChatMessageEntity[]> {
    return this.model
      .find({ $or: [{ sender: owner }, { receiver: owner }], read: false, type: EMessageTargets.Chat })
      .select({ chatId: true, sender: true, receiver: true, createdAt: true })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async update(
    chatId: string,
    sender: string,
    data: types.IObjectUpdate<IChatMessageEntity, keyof IChatMessageEntity>,
  ): Promise<void> {
    await this.model.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
