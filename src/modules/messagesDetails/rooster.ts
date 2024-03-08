import RoosterFactory from '../../tools/abstract/rooster';
import type { IMessageDetails } from './entity';
import type Details from './model';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IMessageDetails, typeof Details, EModules.MessageDetails> {}
