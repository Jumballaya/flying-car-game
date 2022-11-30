import {
  InputCallback,
  InputCallbackKeydown,
  InputCallbackKeyup,
} from './types/input-callback.type';

export class Bindings {
  private _keys: Record<
    string,
    { keyDown: InputCallbackKeydown; keyUp?: InputCallbackKeyup }
  > = {};
  private _combos: Array<{ keys: string[]; effect: InputCallback }> = [];

  public get keys() {
    return this._keys;
  }

  public get combos() {
    return this._combos;
  }

  public bindKey(
    key: string,
    keyDown: InputCallbackKeydown,
    keyUp?: InputCallbackKeyup,
  ) {
    this._keys[key] = { keyDown, keyUp };
  }

  public unbind(key: string) {
    if (key in this._keys) {
      delete this._keys[key];
    }
  }

  public duplicateBinding(keyToCopy: string, key: string) {
    if (keyToCopy in this._keys) {
      this._keys[key] = this._keys[keyToCopy];
    }
  }

  public rebindKey(oldKey: string, newKey: string) {
    if (oldKey in this._keys) {
      this._keys[newKey] = this._keys[oldKey];
      delete this._keys[oldKey];
    }
  }

  public bindCombo(keys: string[], effect: InputCallback) {
    this._combos.push({ keys, effect });
  }
}
