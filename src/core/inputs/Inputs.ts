import { Bindings } from './Bindings';

export class Inputs {
  private _mouse = {
    x: 0,
    y: 0,
    leftClick: false,
    rightClick: false,
    midleClick: false,
    scrolling: 0,
  };

  private keys: Map<string, number> = new Map(); // keyCode: startTime
  private lastKey = '';
  private combos: Array<string> = [];
  private timeSinceLastKeyPress = Infinity;

  constructor(
    private target: EventTarget,
    private bindings: Bindings,
    private comboThresholdMS = 250,
    private comboExact = false,
  ) {
    this.setupKeyboardEvents();
    this.setupMouseEvents();
  }

  public get mouse() {
    const m = { ...this._mouse };
    this._mouse.scrolling = 0;
    return m;
  }

  public get keyList(): Array<string> {
    return Array.from(this.keys).map(([key, value]) => key);
  }

  public get comboList(): Array<string> {
    return [...this.combos];
  }

  public lastKeyPressed(): string | null {
    if (this.lastKey === '') return null;
    return this.lastKey;
  }

  public keyIsPressed(key: string): boolean {
    return this.keys.has(key);
  }

  public keysArePressed(keys: string[]): boolean {
    return keys.every((k) => this.keyIsPressed(k));
  }

  public checkCombo(combo: string[]): boolean {
    if (this.comboExact) {
      return this.combos.join('') === combo.join('');
    }
    if (this.combos.join('') === '') return false;
    return this.combos.join('').endsWith(combo.join(''));
  }

  public checkCombos(comboList: string[][]): boolean[] {
    return comboList.map(this.checkCombo);
  }

  public clearCombos() {
    this.combos = [];
  }

  private checkKeyDown(key: string) {
    this.bindings.keys[key].keyDown();

    // check combos
    for (const combo of this.bindings.combos) {
      if (this.checkCombo(combo.keys)) {
        combo.effect();
        this.clearCombos();
      }
    }
  }

  private checkKeyUp(key: string, time: number) {
    const dt = Date.now() - time;
    this.bindings.keys[key]?.keyUp?.(dt);
  }

  private setupKeyboardEvents() {
    this.target.addEventListener('keyup', (evt: Event) => {
      const e = evt as KeyboardEvent;
      const key = e.key;

      if (this.lastKey === key) {
        this.lastKey = Array.from(this.keys).pop()?.[0] || '';
      }
      const entry = this.keys.get(key);
      if (entry) {
        this.checkKeyUp(key, entry);
        this.keys.delete(key);
      }
    });
    this.target.addEventListener('keydown', (evt: Event) => {
      const e = evt as KeyboardEvent;
      const key = e.key;
      const entry = this.keys.get(key);
      const time = Date.now();
      const deltaT = time - this.timeSinceLastKeyPress;

      if (entry) {
        return;
      }

      this.timeSinceLastKeyPress = time;
      if (deltaT < this.comboThresholdMS || this.combos.length === 0) {
        this.combos.push(key);
      } else {
        this.combos = [key];
      }

      this.lastKey = key;
      this.keys.set(key, Date.now());

      this.checkKeyDown(key);
    });
  }

  private setupMouseEvents() {
    this.target.addEventListener('mousedown', (evt: Event) => {
      const e = evt as MouseEvent;
      switch (e.button) {
        case 0: {
          this._mouse.leftClick = true;
          break;
        }
        case 1: {
          this._mouse.midleClick = true;
          break;
        }
        case 2: {
          this._mouse.rightClick = true;
          break;
        }
      }
    });
    this.target.addEventListener('mouseup', (evt: Event) => {
      const e = evt as MouseEvent;
      switch (e.button) {
        case 0: {
          this._mouse.leftClick = false;
          break;
        }
        case 1: {
          this._mouse.midleClick = false;
          break;
        }
        case 2: {
          this._mouse.rightClick = false;
          break;
        }
      }
    });
    this.target.addEventListener('wheel', (evt: Event) => {
      const e = evt as WheelEvent;
      this._mouse.scrolling = Math.sign(e.deltaY);
    });
    this.target.addEventListener('mousemove', (evt: Event) => {
      const e = evt as MouseEvent;
      this._mouse.x = e.clientX;
      this._mouse.y = e.clientY;
    });
  }
}
