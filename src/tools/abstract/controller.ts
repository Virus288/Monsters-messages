import type { EModules } from './enums';
import type { IModulesControllers } from './types';

export default abstract class ControllerFactory<T extends EModules> {
  private readonly _rooster: IModulesControllers[T];

  protected constructor(rooster: IModulesControllers[T]) {
    this._rooster = rooster;
  }

  get rooster(): IModulesControllers[T] {
    return this._rooster;
  }
}
