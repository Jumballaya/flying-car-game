import * as THREE from 'three';

interface WithModel {
  model: THREE.Object3D<THREE.Event>;
}

type Ctor<T> = {
  new (...params: any[]): T;
};

export class EntityPool<T extends WithModel> {
  private _entities: Array<T> = [];

  constructor(ctor: Ctor<T>, params: () => unknown[], count: number) {
    for (let i = 0; i < count; i++) {
      this._entities.push(new ctor(...params()));
    }
  }

  public map(fn: (entity: T, index: number) => T): Array<T> {
    return this._entities.map(fn);
  }

  public forEach(fn: (entity: T, index: number) => void) {
    this._entities.forEach(fn);
  }

  get entities(): Array<T> {
    return this._entities;
  }

  get meshes(): Array<THREE.Object3D<THREE.Event>> {
    return this._entities.map((e) => e.model);
  }

  get length(): number {
    return this._entities.length;
  }
}
