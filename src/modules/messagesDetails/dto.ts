import Validation from '../../tools/validation';
import type { IMessageDetailsDto } from './types';

export default class MessageDetailsDto implements IMessageDetailsDto {
  message: string;

  constructor(data: IMessageDetailsDto) {
    this.message = data.message;

    this.validate();
  }

  private validate(): void {
    new Validation(this.message, 'body').isDefined().isString().hasLength(1000, 2);
  }
}
