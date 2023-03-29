import type { EModules } from './enums';
import type { IModulesHandlers } from './types';

export default abstract class HandlerFactory<T extends Exclude<EModules, EModules.MessageDetails>> {
  private readonly _controller: IModulesHandlers[T];

  protected constructor(controller: IModulesHandlers[T]) {
    this._controller = controller;
  }

  get controller(): IModulesHandlers[T] {
    return this._controller;
  }
}
