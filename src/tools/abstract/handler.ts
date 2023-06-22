import type { EModules } from './enums';
import type { IModulesHandlers } from './types';

export default abstract class HandlerFactory<T extends Exclude<EModules, EModules.MessageDetails>> {
  private readonly _getController: IModulesHandlers[T];

  protected constructor(controller: IModulesHandlers[T]) {
    this._getController = controller;
  }

  get getController(): IModulesHandlers[T] {
    return this._getController;
  }
}
