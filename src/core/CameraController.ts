import * as THREE from 'three';

export class CameraController {
  private orbitMode = false;
  private startPosition = new THREE.Vector3(5, 0, 10);

  constructor(
    private camera: THREE.PerspectiveCamera,
    private element: HTMLCanvasElement,
  ) {
    camera.position.copy(this.startPosition);
  }

  public startOrbitMode() {
    this.orbitMode = true;
  }

  public startPlayerMode() {
    this.camera.position.copy(this.startPosition);
    this.camera.lookAt(this.startPosition);
    this.orbitMode = false;
  }

  public update(focus: THREE.Vector3) {
    if (this.orbitMode) {
      // Run orbit cam
      const t = Date.now() / 10000;
      const angle = 0.5 * Math.PI * t + Math.PI;
      const sinX = 4 * Math.sin(angle) + focus.x;
      const cosX = 4 * Math.cos(angle) + focus.z;
      this.camera.position.z = cosX;
      this.camera.position.x = sinX;
      this.camera.position.y = 2.25;
      this.camera.lookAt(focus);
    } else {
      this.playerCam(focus);
    }
  }

  private playerCam(focus: THREE.Vector3) {
    const xDist = Math.abs(focus.x);
    const xMove = xDist / 1.5;
    this.camera.position.x = xMove * (focus.x > 0 ? 1 : -1);

    const zDist = Math.abs(focus.z);
    const yMove = zDist / 5;
    if (focus.z < 0) {
      this.camera.position.y = 5 + yMove;
    } else {
      this.camera.position.y = 5 - yMove;
    }
  }
}
