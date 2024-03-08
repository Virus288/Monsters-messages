import mongoose from 'mongoose';
import SendChatMessageDto from './dto';
import { EMessageTargets } from '../../../enums';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Details from '../../messagesDetails/controller';
import Chat from '../model';
import Rooster from '../rooster';
import type { ISendChatMessageDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Chat> {
  private readonly _details: Details;

  constructor() {
    super(new Rooster(Chat));
    this._details = new Details();
  }

  private get details(): Details {
    return this._details;
  }

  async send(data: ISendChatMessageDto, userId: string): Promise<void> {
    const payload = new SendChatMessageDto(data);
    if (payload.receiver === userId) throw new errors.ActionNotAllowed();
    const { body, sender, receiver } = payload;

    let convId = new mongoose.Types.ObjectId().toString();
    const chatExist = await this.rooster.getOne(sender, receiver);
    if (chatExist) convId = chatExist.chatId;

    const id = await this.details.add(body);
    await this.rooster.add({
      ...payload,
      body: id.toString(),
      owner: sender,
      type: EMessageTargets.Chat,
      chatId: convId,
    });
  }
}
