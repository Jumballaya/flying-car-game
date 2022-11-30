import * as THREE from 'three';

export class Luggage {
  public model: THREE.Object3D<THREE.Event>;

  private time = 0;

  constructor(model: THREE.Object3D<THREE.Event>, private index = 0) {
    this.model = model.clone(true);
    this.generatePosition();
  }

  public update(deltaT: number, paused = false) {
    this.time += deltaT / 500;
    this.model.rotation.y = this.time;

    if (paused) return;

    this.model.position.z += 0.25;

    if (this.model.position.z > 10) {
      this.generatePosition();
    }
  }

  public reset() {
    this.generatePosition();
  }

  private generatePosition() {
    this.model.position.z = (Math.random() * 10 + (65 + 10 * this.index)) * -1;
    this.model.position.x = Math.random() * 14 - 7;
    this.model.rotateY(Math.random() * 2 * Math.PI);
  }
}
